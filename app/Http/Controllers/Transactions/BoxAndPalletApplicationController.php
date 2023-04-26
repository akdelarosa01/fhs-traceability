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
use App\Models\PalletQaDisposition;
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

        if (isset($req->id)) {
            $this->validate($req, [
                'model_id' => 'required',
                'target_hs_qty' => 'required|numeric|min:0|not_in:0'
            ]);

            try {
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

            
        } else {
            $this->validate($req, [
                'model_id' => [
                    'required',
                    Rule::unique('pallet_transactions')->where(function ($query) use ($req) {
                        return $query->where('model_id', $req->model_id)
                                ->where('is_deleted', '=', 0)
                                ->whereRaw(DB::raw("DATE_FORMAT(created_at,'%Y-%m-%d') = '".date('Y-m-d')."'"));
                    })
                ],
                'target_hs_qty' => 'required|numeric|min:0|not_in:0',
            ], [
                'model_id.unique' => 'This model was already had a transaction for this day.',
            ]);

            try {
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
        $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
                    DB::raw("p.id as id"),
                    DB::raw("p.model_id as model_id"),
                    DB::raw("m.model as model"),
                    DB::raw("p.transaction_id as transaction_id"),
                    DB::raw("CASE 
                                WHEN p.new_box_count IS NOT NULL THEN 1
                                ELSE 0 END as is_broken_pallet"),
                    DB::raw("CASE WHEN p.pallet_status = 0 THEN 'NOT STARTED' ELSE qad.disposition END as pallet_status"),
                    DB::raw("p.pallet_status as pallet_dispo_status"),
                    DB::raw("qad.disposition as disposition"),
                    DB::raw("qad.color_hex as color_hex"),
                    DB::raw("p.pallet_qr as pallet_qr"),
                    DB::raw("p.new_box_count as new_box_count"),
                    DB::raw("b.box_count as box_count"),
                    DB::raw("p.pallet_location as pallet_location"),
                    DB::raw("p.is_printed as is_printed"),
                    DB::raw("IFNULL(p.new_box_count, m.box_count_per_pallet) AS box_count_per_pallet"),
                    DB::raw("p.created_at as created_at"),
                    DB::raw("p.updated_at as updated_at"),
                    DB::raw("r.disposition as reason"),
                    DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
                ])
                ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
                ->leftJoin('pallet_qa_dispositions as qad','p.pallet_status','=','qad.id')
                ->leftJoin(DB::raw("(SELECT COUNT(box_qr) as box_count, pallet_id from pallet_box_pallet_dtls group by pallet_id) as b"),'b.pallet_id','=','p.id')
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
                    'box_qr' => [
                        Rule::unique('pallet_box_pallet_dtls')->where(function ($query) use ($req) {
                            return $query->where([
                                ['box_qr', '=', $req->box_qr],
                                ['is_deleted','=', 0],
                                ['pallet_history','=', 0]
                            ]);
                        }),
                        'exists:tinspectionsheetprintdata,BoxSerialNo'
                    ], 
                    
                ];
        $customMessages = [
            'unique' => 'This Box ID was already scanned.',
            'exists' => "This Box ID doesn't exist or was not scanned in Packaging System.",
        ];

        $this->validate($req, $rules, $customMessages);

        try {
            DB::beginTransaction();

            $dtl = new PalletBoxPalletDtl();

            $dtl->transaction_id = $req->trans_id;
            $dtl->pallet_id = $req->pallet_id;
            $dtl->model_id = $req->selected_model_id;
            $dtl->box_qr = $req->box_qr;
            $dtl->create_user = Auth::user()->id;
            $dtl->update_user = Auth::user()->id;

            if ($dtl->save()) {
                $dispo = PalletQaDisposition::where('disposition','LIKE','%ON PROGRESS%')->orderBy('id','desc')->first();

                if ($dispo) {
                    $hdr =  PalletBoxPalletHdr::find($dtl->pallet_id);
                    if($hdr->pallet_status == 0) {
                        $hdr->pallet_status = $dispo->id;
                        $hdr->update();
                    }
                }
                
                $count = DB::table('pallet_box_pallet_hdrs as h')
                            ->join('pallet_box_pallet_dtls as d','d.pallet_id','=','h.id')
                            ->select('d.id')
                            ->where('h.transaction_id', $req->trans_id)
                            ->where('is_deleted',0)
                            ->count();

                if ($req->total_box_qty == $count) {
                    $this->change_to_ready_status($req);
                }

                DB::commit();

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
            $remove_boxes = false;
            $update_box = false;

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

            if ($update_box || $remove_boxes) {
                DB::commit();
                $count = PalletBoxPalletDtl::where('transaction_id',$req->trans_id)->where('is_deleted',0)->count();

                $data = [
                    'msg' => 'Updating boxes were successful.',
                    'data' => [
                        'total_scanned_box_qty' => $count
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

    private function change_to_ready_status($req)
    {
        $trans = PalletTransaction::find($req->selected_model_id);
        $trans->model_status = 1;
        $trans->update_user = Auth::user()->id;
        $trans->update();
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
            $pallet->pallet_status = 0;
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
            $sql = "SELECT id, pallet_id, pallet_qr, created_at
                        FROM furukawa.pallet_history_hdrs
                        where pallet_id = ". $req->pallet_id;
            $query = DB::select($sql);
            
            return Datatables::of($query)->make(true);

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    public function get_pallet_history_details(Request $req)
    {
        $data = [];
        try {
            $sql = "SELECT h.box_qr as box_qr,
                            b.box_judgment
                        FROM furukawa.pallet_history_dtls as h
                        join furukawa.pallet_box_pallet_dtls as b
                        on b.id = h.box_id
                        where h.history_id = ". $req->history_id;
            $query = DB::select($sql);
            
            $data = [
                'data' => $query,
                'success' => true
            ];

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
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

            $pallet_qr = $data['pallet_qr'];

            if (strpos($data['pallet_qr'], 'R') == false) {
                $pallet_qr = $pallet_qr.'R';
            }

            $pallet_id = $data['id'];
            $pallet = PalletBoxPalletHdr::find($pallet_id);
            $pallet->pallet_qr = $pallet_qr;
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
                                        // 'is_deleted' => 1,
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

    public function new_pallet(Request $req)
    {
        $data = [
            'msg' => 'Creating new pallet has failed.',
            'data' => [
                'pallet' => []
            ],
            'success' => true,
            'msgType' => 'failed',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (isset($req->trans_id)) {
                $hdr = new PalletBoxPalletHdr();
                $hdr->transaction_id = $req->trans_id;
                $hdr->model_id = $req->model_id;
                $hdr->pallet_qr = $this->generatePalletID($req->trans_id,$req);
                $hdr->pallet_status = 0;
                $hdr->pallet_location = "PRODUCTION";
                $hdr->create_user = Auth::user()->id;
                $hdr->update_user = Auth::user()->id;

                if ($hdr->save()) {
                    $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
                                DB::raw("p.id as id"),
                                DB::raw("p.model_id as model_id"),
                                DB::raw("m.model as model"),
                                DB::raw("p.transaction_id as transaction_id"),
                                DB::raw("CASE 
                                            WHEN p.new_box_count IS NOT NULL THEN 1
                                            ELSE 0 END as is_broken_pallet"),
                                DB::raw("CASE WHEN p.pallet_status = 0 THEN 'NOT STARTED' ELSE qad.disposition END as pallet_status"),
                                DB::raw("p.pallet_status as pallet_dispo_status"),
                                DB::raw("qad.disposition as disposition"),
                                DB::raw("qad.color_hex as color_hex"),
                                DB::raw("p.pallet_qr as pallet_qr"),
                                DB::raw("p.new_box_count as new_box_count"),
                                DB::raw("b.box_count as box_count"),
                                DB::raw("p.pallet_location as pallet_location"),
                                DB::raw("p.is_printed as is_printed"),
                                DB::raw("IFNULL(p.new_box_count, m.box_count_per_pallet) AS box_count_per_pallet"),
                                DB::raw("p.created_at as created_at"),
                                DB::raw("p.updated_at as updated_at"),
                                DB::raw("r.disposition as reason"),
                                DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
                            ])
                            ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                            ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
                            ->leftJoin('pallet_qa_dispositions as qad','p.pallet_status','=','qad.id')
                            ->leftJoin(DB::raw("(SELECT COUNT(box_qr) as box_count, pallet_id from pallet_box_pallet_dtls group by pallet_id) as b"),'b.pallet_id','=','p.id')
                            ->where('p.id',$hdr->id)->first();

                    $data = [
                        'msg' => 'New Pallet was created successfully.',
                        'data' => [
                            'pallet' => $query
                        ],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            } else {
                $data = [
                    'msg' => 'Please select a Model Transaction.',
                    'data' => [
                        'pallet' => []
                    ],
                    'success' => true,
                    'msgType' => 'failed',
                    'msgTitle' => 'Failed!'
                ];
            }
            

            
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [
                    'pallet' => []
                ],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }
}
