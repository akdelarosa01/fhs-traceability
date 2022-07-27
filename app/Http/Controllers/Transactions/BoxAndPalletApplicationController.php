<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletBoxPalletDtl;
use App\Models\PalletBoxPalletHdr;
use App\Models\PalletModelMatrix;
use App\Models\PalletPageAccess;
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
        return view('transactions.box_and_pallet_application', [
            'pages' => $pages,
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
                        DB::raw("t.target_no_of_pallet as target_no_of_pallet"),
                        DB::raw("m.model as model"),
                        DB::raw("m.box_count_per_pallet as box_count_per_pallet"),
                        DB::raw("t.created_at as created_at")
                    ])
                    ->join('pallet_model_matrices as m','t.model_id','=','m.id');

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
            'target_no_of_pallet' => 'required|numeric|min:0|not_in:0',
        ]);

        try {
            $trans = new PalletTransaction();
            
            $trans->model_id = $req->model_id;
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

        $rules = ['box_qr' => 'unique:pallet_box_pallet_dtls,box_qr'];
        $customMessages = [
            'unique' => 'This Box ID was already scanned.'
        ];

        $this->validate($req, $rules, $customMessages);

        try {
            $dtl = new PalletBoxPalletDtl();

            $dtl->pallet_id = $req->pallet_id;
            $dtl->model_id = $req->selected_model_id;
            $dtl->box_qr = $req->box_qr;
            $dtl->create_user = Auth::user()->id;
            $dtl->update_user = Auth::user()->id;

            if ($dtl->save()) {

                $data = [
                    'data' => [],
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

<<<<<<< HEAD
=======
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
                $data = [
                    'msg' => 'Updating boxes were successful.',
                    'data' => [],
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

>>>>>>> 4e94d8115e76d7914310720409d51a0285fedaa0
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
        $query = DB::connection('mysql')->table('pallet_box_pallet_dtls as b')
                    ->select(
                        'b.id',
                        'b.pallet_id',
                        'b.model_id',
                        'm.model',
                        'm.box_count_per_pallet',
                        'b.box_qr',
                        'b.created_at',
                        'b.updated_at'
                    )
                    ->join('pallet_model_matrices as m','m.id','=','b.model_id')
                    ->where('b.pallet_id',$pallet_id)
                    ->orderBy('b.id','desc');
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
            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
            $pallet->is_printed = 1;
            $pallet->update_user = Auth::user()->id;

<<<<<<< HEAD
            if ($req->mode == 'print') {
                $pallet->pallet_status = 1; // FOR OBA
            }

            if ($pallet->update()) {
=======
            $lot_nos = $this->_helpers->lot_no($box_qr);
            $lots = "";

            foreach ($lot_nos as $key => $lot) {
                $lots .= $lot->lot_no."\r";
            }

            $print_date = date('Y-m-d H:i:s');
            $month = $req->month;

            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
            $pallet->is_printed = 1;
            $pallet->update_user = Auth::user()->id;

            if ($req->mode == 'print') {
                $pallet->pallet_status = 1; // FOR OBA
                $pallet->print_date = $print_date;
            } else { // reprint
                $print_date = $pallet->print_date;
                $month = "";
            }
>>>>>>> 4e94d8115e76d7914310720409d51a0285fedaa0

            if ($pallet->update()) {
                if ($req->mode == 'print') {
<<<<<<< HEAD
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

                $print = new PalletPrintPalletLabel();

                $print->model = $req->model;
                $print->lot_no = $req->lot_no;
                $print->box_qty = $req->box_qty;
                $print->box_qr = $req->box_qr;
                $print->pallet_qr = $req->pallet_qr;
                $print->print_date = date('Y-m-d H:i:s');

                if ($print->save()) {
                    $data = [
                        'msg' => $req->pallet_qr.' Pallet Label Print Successfully! Please wait for the Pallet Label to print.',
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            }
=======
                    $pallet_count = PalletBoxPalletHdr::where('transaction_id', $req->trans_id)->count();
    
                    $trans = PalletTransaction::find($req->trans_id);
    
                    if ($trans->target_no_of_pallet > $pallet_count) {
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
                }

                // insert into the Bartender Table
                $print = new PalletPrintPalletLabel();

                $print->month = $month;
                $print->model = $req->model;
                $print->lot_no = $lots;
                $print->box_qty = $req->box_qty;
                $print->box_qr = $req->box_qr;
                $print->pallet_qr = $req->pallet_qr;
                $print->print_date = $print_date;

                if ($print->save()) {
                    $data = [
                        'msg' => $req->pallet_qr.' Pallet Label Print Successfully! Please wait for the Pallet Label to print.',
                        'data' => [],
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

>>>>>>> 4e94d8115e76d7914310720409d51a0285fedaa0
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
            $update = DB::connection('mysql')->table('pallet_box_pallet_hdrs')->whereIn('id',$req->ids)->update([
                'pallet_location' => "Q.A.",
                'update_user' => Auth::user()->id,
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            if ($update) {

                $msg = "Pallet was successfully transferred.";

                if (count($req->ids) > 0) {
                    $msg = "Pallets were successfully transferred.";
                }

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

    public function check_authorization()
    {
        $data = [
			'msg' => 'Checking Authorization was failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $user_id = Auth::user()->id;
            $page_access = new PalletPageAccess();
            $permission = $page_access->check_permission($user_id, 'BoxAndPalletApplication');

            if ($permission > 0) {
                $data = [
                    'data' => [
                        'permission' => true
                    ],
                    'success' => true,
                ];
            } else {
                $data = [
                    'data' => [
                        'permission' => false
                    ],
                    'success' => true,
                ];
            }

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => true,
                'msgType' => 'warning',
                'msgTitle' => 'Failed!'
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
            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
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
}
