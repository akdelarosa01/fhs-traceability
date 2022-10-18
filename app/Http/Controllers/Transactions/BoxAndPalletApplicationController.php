<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Events\PalletTransferred;
use App\Models\PalletBoxPalletDtl;
use App\Models\PalletBoxPalletHdr;
use App\Models\PalletHistoryDtl;
use App\Models\PalletHistoryHdr;
use App\Models\PalletModelMatrix;
use App\Models\PalletPrintPalletLabel;
use App\Models\PalletTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Yajra\Datatables\Datatables;

class BoxAndPalletApplicationController extends Controller
{
    protected $_helpers;

    public function __construct()
    {
        $this->middleware('auth');
        $this->_helpers = new Helpers;
    }
    
    public function index()
    {
        $pages = session('pages');
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'BoxAndPalletApplication');

        return view('transactions.box_and_pallet_application', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('transactions.box-and-pallet')
        ]);
    }

    public function get_models(Request $req)
    {
        $results = [];
        $val = (!isset($req->q))? "" : $req->q;
        $display = (!isset($req->display))? "" : $req->display;
        $addOptionVal = (!isset($req->addOptionVal))? "" : $req->addOptionVal;
        $addOptionText = (!isset($req->addOptionText))? "" : $req->addOptionText;
        $sql_query = (!isset($req->sql_query))? "" : $req->sql_query;
        $where = "";

        try {
            if ($addOptionVal != "" && $display == "id&text") {
                array_push($results, [
                    'id' => $addOptionVal,
                    'text' => $addOptionText
                ]);
            }

            if ($sql_query == null || $sql_query == "") {
                $results = PalletModelMatrix::select(
                                'id as id',
                                DB::raw("CONCAT(model,' | ', model_name) as text"),
                                'box_count_per_pallet',
                                'hs_count_per_box',
                                'model',
                                'model_name'
                            )->where('is_deleted',0);

                if ($val !== "") {
                    $results->where(DB::raw("CONCAT(model,' | ', model_name)"),'like',"%" . $val . "%");
                }
            }
            
            $results = $results->get();

        } catch(\Throwable $th) {
            return [
                'success' => false,
                'msessage' => $th->getMessage()
            ];
        }
        
        return $results;
    }

    public function model_transaction_list()
    {
        $data = [];
        try {
            $query = DB::connection('mysql')->table('pallet_transactions as t')->select([
                        DB::raw("t.id as id"),
                        DB::raw("t.model_id as model_id"),
                        DB::raw("t.model_status as model_status"),
                        DB::raw("t.target_hs_qty as target_hs_qty"),
                        DB::raw("t.total_box_qty as total_box_qty"),
                        DB::raw("t.target_no_of_pallet as target_no_of_pallet"),
                        DB::raw("m.model as model"),
                        DB::raw("CONCAT(m.model,' | ', m.model_name) as model_name"),
                        DB::raw("m.box_count_per_pallet as box_count_per_pallet"),
                        DB::raw("m.hs_count_per_box as hs_count_per_box"),
                        DB::raw("dt.total_scanned_box_qty as total_scanned_box_qty"),
                        DB::raw("t.created_at as created_at")
                    ])
                    ->join('pallet_model_matrices as m','t.model_id','=','m.id')
                    ->leftJoin(DB::raw("(SELECT count(box_qr) as total_scanned_box_qty, transaction_id 
                                        FROM pallet_box_pallet_dtls
                                        WHERE is_deleted = 0
                                        group by transaction_id) as dt"),'dt.transaction_id','=','t.id')
                    ->where('t.is_deleted',0)
                    ->groupBy(
                        't.id',
                        't.model_id',
                        't.model_status',
                        't.target_hs_qty',
                        't.total_box_qty',
                        't.target_no_of_pallet',
                        'm.model',
                        'm.model_name',
                        'm.box_count_per_pallet',
                        'm.hs_count_per_box',
                        'dt.total_scanned_box_qty',
                        't.created_at'
                    )->orderBy('t.created_at','desc');

            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }

    public function proceed(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Creating transaction has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $this->validate($req, [
            'model_id' => 'required',
            'target_hs_qty' => 'required|numeric|min:0|not_in:0',
        ]);

        try {
            if (isset($req->id)) {
                $trans = PalletTransaction::find($req->id);
            
                $trans->target_hs_qty = $req->target_hs_qty;
                $trans->total_box_qty = $req->total_box_qty;
                $trans->target_no_of_pallet = $req->target_no_of_pallet;
                $trans->model_status = 0;
                $trans->update_user = Auth::user()->id;

                if ($trans->update()) {
                    $data = [
                        'msg' => 'Transaction has successfully updated.',
                        'data' => [],
                        'inputs' => $inputs,
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            } else {
                $trans = new PalletTransaction();
            
                $trans->model_id = $req->model_id;
                $trans->target_hs_qty = $req->target_hs_qty;
                $trans->total_box_qty = $req->total_box_qty;
                $trans->target_no_of_pallet = $req->target_no_of_pallet;
                $trans->model_status = 0;
                $trans->create_user = Auth::user()->id;
                $trans->update_user = Auth::user()->id;

                if ($trans->save()) {
                    $hdr = new PalletBoxPalletHdr();
                    $hdr->transaction_id = $trans->id;
                    $hdr->model_id = $req->model_id;
                    $hdr->pallet_qr = $this->generatePalletID($trans->id,$req);
                    $hdr->pallet_status = 0;
                    $hdr->pallet_location = "PRODUCTION";
                    $hdr->create_user = Auth::user()->id;
                    $hdr->update_user = Auth::user()->id;

                    $hdr->save();

                    $data = [
                        'msg' => 'Transaction has successfully proceeded.',
                        'data' => [],
                        'inputs' => $inputs,
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            }
            
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'inputs' => $inputs,
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    private function generatePalletID($trans_id,$req)
    {
        $pallet_count = PalletBoxPalletHdr::where([
                            ['transaction_id', '=', $trans_id],
                            ['model_id', '=', $req->model_id]
                        ])->count();

        $pallet_count = $pallet_count + 1;
        $serial = $this->leadingZeros($pallet_count);

        $date = date('Ymd');
        $pallet = $req->model."P".$date."-".$serial;

        return $pallet;
    }

    private function leadingZeros($count)
    {
        return sprintf("%03d", $count);
    }

    public function get_pallets(Request $req)
    {
        $data = [];
        try {
            $query = $this->pallets($req->trans_id);
            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    private function pallets($trans_id)
    {
        $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')
                    ->select(
                        'p.id',
                        'p.transaction_id',
                        'p.model_id',
                        'm.model',
                        DB::raw("IFNULL(p.new_box_count, m.box_count_per_pallet) AS box_count_per_pallet"),
                        'p.pallet_qr',
                        'p.pallet_status',
                        'p.pallet_location',
                        'p.is_printed',
                        'p.created_at',
                        'p.updated_at'
                    )
                    ->join('pallet_model_matrices as m','m.id','=','p.model_id')
                    ->where('p.transaction_id',$trans_id);
        return $query;
    }

    public function save_box(Request $req)
    {
        $data = [
			'msg' => 'Creating transaction has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $rules = [
                    'box_qr' => 'unique:pallet_box_pallet_dtls,box_qr|exists:tboxqr,qrBarcode'
                ];
        $customMessages = [
            'unique' => 'This Box ID was already scanned.',
        ];

        $this->validate($req, $rules, $customMessages);

        try {
            $dtl = new PalletBoxPalletDtl();

            $dtl->transaction_id = $req->trans_id;
            $dtl->pallet_id = $req->pallet_id;
            $dtl->model_id = $req->selected_model_id;
            $dtl->box_qr = $req->box_qr;
            $dtl->create_user = Auth::user()->id;
            $dtl->update_user = Auth::user()->id;

            if ($dtl->save()) {
                $count = DB::table('pallet_box_pallet_hdrs as h')
                            ->join('pallet_box_pallet_dtls as d','d.pallet_id','=','h.id')
                            ->select('d.id')
                            ->where('h.transaction_id', $req->trans_id)
                            ->where('is_deleted',0)
                            ->count();

                $data = [
                    'data' => [
                        'count' => $count,
                        'box_data' => $dtl,
                        'success' => true
                    ],
                    'success' => true
                ];
            }
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function update_box(Request $req)
    {
        $data = [
			'msg' => 'Saving boxes has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            DB::beginTransaction();
            // remove all boxes that were removed
            if (isset($req->remove_box_id) && count($req->remove_box_id) > 0) {
                $remove_boxes = DB::connection('mysql')->table('pallet_box_pallet_dtls')->whereIn('id',$req->remove_box_id)
                                ->update([
                                    'is_deleted' => 1,
                                    'update_user' => Auth::user()->id,
                                    'updated_at' => date('Y-m-d H:i:s')
                                ]);
            }

            // update all boxes that has remarks
            if (isset($req->update_box_id) && count($req->update_box_id) > 0) {
                foreach ($req->update_box_id as $key => $id) {
                    $update_box = DB::connection('mysql')->table('pallet_box_pallet_dtls')->where('id',$id)
                                ->update([
                                    'remarks' => $req->remarks_input[$key],
                                    'update_user' => Auth::user()->id,
                                    'updated_at' => date('Y-m-d H:i:s')
                                ]);
                }
            }
            if ($update_box) {
                DB::commit();
                $count = PalletBoxPalletDtl::where('pallet_id',$req->trans_id)->where('is_deleted',0)->count();

                $data = [
                    'msg' => 'Updating boxes were successful.',
                    'data' => [
                        'count' => $count
                    ],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }
        return response()->json($data);
    }

    public function get_boxes(Request $req)
    {
        $data = [];
        try {
            $query = $this->boxes($req->pallet_id);
            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    private function boxes($pallet_id)
    {
        $query = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                    ->select(
                        DB::raw("pb.id as id"),
                        DB::raw("pb.pallet_id as pallet_id"),
                        DB::raw("pb.model_id as model_id"),
                        DB::raw("pb.box_qr as box_qr"),
                        DB::raw("pb.remarks as prod_remarks"),
                        DB::raw("'' as remarks"),
                        DB::raw("IFNULL(pb.box_judgment,-1) AS box_judgement"),
                        DB::raw("m.hs_count_per_box as hs_count_per_box"),
                        DB::raw("m.box_count_per_pallet as box_count_per_pallet"),
                        DB::raw("pb.created_at as created_at"),
                        DB::raw("pb.updated_at as updated_at")
                    )
                    ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                    ->where('pb.pallet_id', $pallet_id)
                    ->where('pb.is_deleted', 0)
                    ->orderBy('pb.id', 'desc');
        return $query;
    }

    public function print_pallet(Request $req)
    {
        $data = [
			'msg' => 'Printing Pallet Label has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $box_qr = explode(";",$req->box_qr);

            $lot_nos = $this->_helpers->lot_no($box_qr);
            $lots = "";

            foreach ($lot_nos as $key => $lot) {
                $lots .= $lot->lot_no."\r";
            }

            $print_date = date('Y-m-d');
            $month = $req->month;

            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
            $pallet->is_printed = 1;
            $pallet->update_user = Auth::user()->id;

            if ($req->mode == 'print') {
                $pallet->pallet_status = 1; // FOR OBA
                $pallet->print_date = $print_date;
            } else { // reprint
                $print_date = date('Y/m/d',strtotime($pallet->print_date));
                $month = strtoupper(date('M',strtotime($pallet->print_date)));
            }

            if ($pallet->update()) {
                $pallet_count = PalletBoxPalletHdr::where('transaction_id', $req->trans_id)->count();

                $trans = PalletTransaction::find($req->trans_id);

                if ($this->needToCreateNewPallet($req, $pallet_count)) {
                    $hdr = new PalletBoxPalletHdr();
                    $hdr->transaction_id = $req->trans_id;
                    $hdr->model_id = $req->model_id;
                    $hdr->pallet_qr = $this->generatePalletID($req->trans_id,$req);
                    $hdr->pallet_status = 0;
                    $hdr->pallet_location = "PRODUCTION";
                    $hdr->create_user = Auth::user()->id;
                    $hdr->update_user = Auth::user()->id;

                    $hdr->save();
                } 
                
                if ($this->readyStatus($req, $pallet_count)) {
                    $trans->model_status = 1;
                    $trans->update();
                }

                $mx = PalletModelMatrix::select('model')->where('id',$req->model_id)->first();

                // insert into the Bartender Table
                $print = new PalletPrintPalletLabel();

                $print->month = $month;
                $print->model = $mx->model;
                $print->lot_no = $lots;
                $print->box_qty = $req->box_qty;
                $print->box_qr = $req->box_qr;
                $print->pallet_qr = $req->pallet_qr;
                $print->print_date = $print_date;

                if ($print->save()) {

                    $query = DB::connection('mysql')->table('pallet_transactions as t')->select([
                                    DB::raw("t.id as id"),
                                    DB::raw("t.model_id as model_id"),
                                    DB::raw("t.model_status as model_status"),
                                    DB::raw("t.target_hs_qty as target_hs_qty"),
                                    DB::raw("t.total_box_qty as total_box_qty"),
                                    DB::raw("t.target_no_of_pallet as target_no_of_pallet"),
                                    DB::raw("m.model as model"),
                                    DB::raw("CONCAT(m.model,' | ', m.model_name) as model_name"),
                                    DB::raw("m.box_count_per_pallet as box_count_per_pallet"),
                                    DB::raw("m.hs_count_per_box as hs_count_per_box"),
                                    DB::raw("dt.total_scanned_box_qty as total_scanned_box_qty"),
                                    DB::raw("t.created_at as created_at")
                                ])
                                ->join('pallet_model_matrices as m','t.model_id','=','m.id')
                                ->leftJoin(DB::raw("(SELECT count(box_qr) as total_scanned_box_qty, transaction_id 
                                                    FROM pallet_box_pallet_dtls
                                                    WHERE is_deleted = 0
                                                    group by transaction_id) as dt"),'dt.transaction_id','=','t.id')
                                ->where('t.id', $req->trans_id)
                                ->groupBy(
                                    't.id',
                                    't.model_id',
                                    't.model_status',
                                    't.target_hs_qty',
                                    't.total_box_qty',
                                    't.target_no_of_pallet',
                                    'm.model',
                                    'm.model_name',
                                    'm.box_count_per_pallet',
                                    'm.hs_count_per_box',
                                    'dt.total_scanned_box_qty',
                                    't.created_at'
                                )->first();
                    $data = [
                        'msg' => $req->pallet_qr.' Pallet Label Print Successfully! Please wait for the Pallet Label to print.',
                        'data' => $query,
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            }

            
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function print_preview(Request $req)
    {
        $data = [
			'msg' => 'Retrieving print values has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $arr_box_qr = [];
            $lot_nos = [];
            $box_qr = "";
            $box_qty = 0;

            $pallet = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')
                        ->select(
                            'm.model',
                            DB::raw("IFNULL(p.new_box_count, m.box_count_per_pallet) AS box_count_per_pallet"),
                            'p.pallet_qr'
                        )
                        ->join('pallet_model_matrices as m','m.id','=','p.model_id')
                        ->where('p.id',$req->pallet_id)
                        ->first();

            $boxes = PalletBoxPalletDtl::where('pallet_id',$req->pallet_id)->get();

            foreach ($boxes as $key => $b) {
                $box_qr .= $b->box_qr.";"."\r\n";
                $box_qty++;
                array_push($arr_box_qr, $b->box_qr);
            }

            $lot_nos = $this->_helpers->lot_no($arr_box_qr);
            $lots = "";

            foreach ($lot_nos as $key => $lot) {
                $lots .= $lot->lot_no."\r";
            }

            $print_date = date('Y/m/d');

            $data = [
                'data' => [
                    'pallet_qr' => $pallet->pallet_qr,
                    'model' => $pallet->model,
                    'box_qr' => $box_qr,
                    'box_qty' => $box_qty,
                    'lot_no' => $lots,
                    'print_date' => $print_date
                ],
                'success' => true
            ];

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function transfer_to(Request $req)
    {
        $data = [
			'msg' => 'Transferring Pallet to Q.A. has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $pallet = PalletBoxPalletHdr::find($req->id);
            $pallet->pallet_location = "Q.A.";
            $pallet->update_user = Auth::user()->id;

            if ($pallet->update()) {

                $msg = "Pallet ".$pallet->pallet_qr." was successfully transferred.";

                $content = [
                    'title' => "Pallet Transferred to Q.A.",
                    'message' => "Pallet ".$pallet->pallet_qr." was transferred for Q.A. Inspection."
                ];

                $pallet_data = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')
                                ->select([
                                    DB::raw("p.id as id"),
                                    DB::raw("p.model_id as model_id"),
                                    DB::raw("p.transaction_id as transaction_id"),
                                    DB::raw("p.pallet_status as pallet_status"),
                                    DB::raw("p.pallet_qr as pallet_qr"),
                                    DB::raw("p.new_box_count as new_box_count"),
                                    DB::raw("p.pallet_location as pallet_location"),
                                    DB::raw("p.is_printed as is_printed"),
                                    DB::raw("m.box_count_to_inspect as box_count_to_inspect"),
                                    DB::raw("p.created_at as created_at"),
                                    DB::raw("p.updated_at as updated_at")
                                ])
                                ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                                ->where([
                                    ['p.pallet_status','=','1'],
                                    ['p.pallet_location','=','Q.A.'],
                                    ['p.id','=',$req->id]
                                ])->first();

                
                $recepients = $this->_helpers->qa_users();
                broadcast(new PalletTransferred($content, $pallet_data, $recepients,'/transactions/qa-inspection/'));

                $data = [
                    'msg' => $msg,
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function set_new_box_count(Request $req)
    {
        $data = [
			'msg' => 'Assigning Broken Pallet was failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $pallet_id = $req->broken_pallet_id;
            $pallet = PalletBoxPalletHdr::find($pallet_id);
            $pallet->new_box_count = $req->new_box_count;
            $pallet->update_user = Auth::user()->id;

            if ($pallet->update()) {

                $data = [
                    'msg' => "Broken Pallet was successfully assigned and has new box count.",
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function delete_transaction(Request $req)
    {
        $data = [
			'msg' => 'Deleting Transaction has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $trans_id = $req->id;

            $pallet_has_box = PalletBoxPalletDtl::where('transaction_id',$trans_id)->count();

            if ($pallet_has_box < 1) {
                foreach ($trans_id as $key => $id) {
                    $trans = PalletTransaction::find($id);
                    $trans->is_deleted = 1;
                    $trans->update_user = Auth::user()->id;
    
                    if ($trans->update()) {
    
                        $data = [
                            'msg' => "Transaction was successfully deleted.",
                            'data' => [],
                            'success' => true,
                            'msgType' => 'success',
                            'msgTitle' => 'Success!'
                        ];
                    }
                }
            } else {
                $data = [
                    'msg' => "This Transaction has already scanned boxes in its pallets.",
                    'data' => [],
                    'success' => true,
                    'msgType' => 'warning',
                    'msgTitle' => 'Failed!'
                ];
            }

            
            
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    private function needToCreateNewPallet($req, $pallet_count)
    {
        if ((int)$req->target_no_of_pallet >= (int)$pallet_count) {
            if ((int)$req->total_box_qty == (int)$req->total_scanned_box_qty) {
                return false;
            }

            if ((int)$req->target_no_of_pallet == (int)$pallet_count) {
                return false;
            }

            $pallets = PalletBoxPalletHdr::where('transaction_id', $req->trans_id)->get();
            foreach ($pallets as $key => $pallet) {
                $boxes = PalletBoxPalletDtl::where('pallet_id',$pallet->id)->count();

                if ($req->box_per_pallet > $boxes) {
                    return false;
                }
            }
        }

        return true;
    }

    private function readyStatus($req, $pallet_count)
    {
        if ((int)$req->target_no_of_pallet == (int)$pallet_count) {
            if ((int)$req->total_box_qty == (int)$req->total_scanned_box_qty) {
                return true;
            }
        }

        return false;
    }

    public function get_affected_serial_no(Request $req)
    {
        $data = [];
        try {
            $query = $this->affected_serial_no($req->pallet_id,$req->box_id);
            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    private function affected_serial_no($pallet_id, $box_id)
    {
        $query = DB::table('qa_affected_serials')->where([
                    ['pallet_id', '=', $pallet_id],
                    ['box_id', '=', $box_id]
                ])
                ->select([
                    DB::raw("id"),
                    DB::raw("pallet_id"),
                    DB::raw("box_id"),
                    DB::raw("hs_serial"),
                    DB::raw("qa_judgment"),
                    DB::raw("remarks"),
                    DB::raw("is_deleted"),
                ]);
                    
        return $query;
    }

    public function get_box_history(Request $req)
    {
        $data = [];
        try {
            $query = $this->serials($req->box_qr);
            return Datatables::of($query)->make(true);

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    private function serials($box_qr)
    {
        $query = DB::connection('mysql')
                    ->select("SELECT case when f.c10 <> '' and f.c10 is not null then f.c10 else f.c4 end as old_serial,
                            case when f.c10 <> '' and f.c10 is not null then f.c4 else '' end as new_serial,
                            b.BoxSerialNo as box_qr
                            FROM furukawa.tinspectionsheetprintdata as b
                            join formal.barcode as f
                            on CASE WHEN right(b.BoxSerialNo,1) = 'R' then SUBSTRING(b.BoxSerialNo,-4,3) else right(b.BoxSerialNo,3) end = LPAD(f.c7,3,'0')
                            and f.c3 = LEFT(b.BoxSerialNo,LENGTH(f.c3))
                            and b.lot_no = f.c9
                            where b.BoxSerialNo = '".$box_qr."R'");

        if (count((array)$query) == 0) {
            $query = DB::connection('mysql')
                    ->select("SELECT case when f.c10 <> '' and f.c10 is not null then f.c10 else f.c4 end as old_serial,
                            case when f.c10 <> '' and f.c10 is not null then f.c4 else '' end as new_serial,
                            b.BoxSerialNo as box_qr
                            FROM furukawa.tinspectionsheetprintdata as b
                            join formal.barcode as f
                            on CASE WHEN right(b.BoxSerialNo,1) = 'R' then SUBSTRING(b.BoxSerialNo,-4,3) else right(b.BoxSerialNo,3) end = LPAD(f.c7,3,'0')
                            and f.c3 = LEFT(b.BoxSerialNo,LENGTH(f.c3))
                            and b.lot_no = f.c9
                            where b.BoxSerialNo = '".$box_qr."'");
        }
        return $query;
    }

    public function get_pallet_history(Request $req)
    {
        $data = [];
        try {
            $sql = "SELECT h.pallet_id as pallet_id,
                            h.pallet_qr as pallet_qr,
                            d.box_qr as box_qr,
                            H.created_at as created_at
                        FROM furukawa.pallet_history_hdrs as h
                        join furukawa.pallet_history_dtls as d
                        on h.id = d.history_id
                        where h.pallet_id = ". $req->pallet_id;
            $query = DB::select($sql);
            
            return Datatables::of($query)->make(true);

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;

        // $data = [
		// 	'msg' => 'Viewing of Pallet History was failed.',
        //     'data' => [
        //         'hdr' => [],
        //         'dtls' => []
        //     ],
		// 	'success' => true,
        //     'msgType' => 'warning',
        //     'msgTitle' => 'Failed!'
        // ];

        // try {
        //     $query = "SELECT h.pallet_id as pallet_id,
        //                 h.pallet_qr as pallet_qr,
        //                 d.box_qr as box_qr,
        //                 H.created_at as created_at
        //             FROM furukawa.pallet_history_hdrs as h
        //             join furukawa.pallet_history_dtls as d
        //             on h.id = d.history_id
        //             where h.pallet_id = ". $req->pallet_id;
        //     $hdr = PalletHistoryHdr::where('pallet_id', $req->pallet_id)->get();
        //     $dtls = PalletHistoryDtl::where('pallet_id', $req->pallet_id)->get();

        //     $data = [
        //         'data' => [
        //             'hdr' => $hdr,
        //             'dtls' => $dtls
        //         ],
        //         'success' => true,
        //     ];

        // } catch (\Throwable $th) {
        //     $data = [
        //         'msg' => 'Viewing of Pallet History was failed.',
        //         'data' => [
        //             'hdr' => [],
        //             'dtls' => []
        //         ],
        //         'success' => true,
        //         'msgType' => 'warning',
        //         'msgTitle' => 'Failed!'
        //     ];
        // }
        // return response()->json($data);
    }

    public function move_to_pallet_history(Request $req)
    {
        $data = [
			'msg' => 'Moving to Pallet History was failed.',
            'data' => [
                'hdr' => [],
                'dtls' => []
            ],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $data = $req->pallet_data;

            DB::beginTransaction();

            $pallet_id = $data['id'];
            $pallet = PalletBoxPalletHdr::find($pallet_id);
            $pallet->pallet_qr = $data['pallet_qr'].'R';
            $pallet->update_user = Auth::user()->id;

            if ($pallet->update()) {
                $history = new PalletHistoryHdr();
                $history->pallet_id = $data['id'];
                $history->pallet_qr = $data['pallet_qr'];
                $history->create_user = Auth::user()->id;
                $history->update_user = Auth::user()->id;

                if ($history->save()) {
                    $boxes = PalletBoxPalletDtl::where('pallet_id',$data['id'])->where('is_deleted',0)->get();

                    foreach ($boxes as $key => $box) {
                        PalletHistoryDtl::insert([
                            'history_id' => $history->id,
                            'pallet_id' => $data['id'],
                            'pallet_qr' => $data['pallet_qr'],
                            'box_id' => $box->id,
                            'box_qr' => $box->box_qr
                        ]);
                    }

                    PalletBoxPalletDtl::where('pallet_id',$data['id'])
                                    ->where('is_deleted',0)
                                    ->update([
                                        'is_deleted' => 1,
                                        'pallet_history' => 1,
                                        'update_user' => Auth::user()->id,
                                        'updated_at' => date('Y-m-d H:i:s')
                                    ]);
                    $dtls = PalletHistoryDtl::where('history_id', $history->id)->get();

                    $data = [
                        'msg' => "Pallet's data was successfully moved as history.",
                        'data' => [
                            'hdr' => $history,
                            'dtls' => $dtls
                        ],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];

                    DB::commit();
                }
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            $data = [
                'msg' => $th->getMessage(),
                'data' => [
                    'hdr' => [],
                    'dtls' => []
                ],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }
}
