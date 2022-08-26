<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Events\PalletTransferred;
use App\Models\PalletBoxNgReason;
use App\Models\PalletBoxPalletHdr;
use App\Models\PalletDispositionReason;
use App\Models\PalletQaDisposition;
use App\Models\QaAffectedSerial;
use App\Models\QaHoldLot;
use App\Models\QaInspectedBoxes;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class QAInspectionController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'QAInspection');

        return view('transactions.qa_inspection', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('transactions.qa-inspection')
        ]);
    }

    public function pallet_list()
    {
        $data = [];

            $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
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
                DB::raw("p.updated_at as updated_at"),
                DB::raw("r.disposition as reason"),
                DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
            ])
            ->join('pallet_model_matrices as m','p.model_id','=','m.id')
            ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
            ->where('p.pallet_location','=','Q.A.');

            return Datatables::of($query)->make(true);
        

        return $data;
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
                        'pb.id',
                        'pb.pallet_id',
                        'pb.model_id',
                        'qa.id as qa_id',
                        'pb.box_qr',
                        DB::raw("ng.reason as remarks"),
                        DB::raw("IFNULL(qa.box_qr_judgement,-1) AS box_qr_judgement"),
                        DB::raw("IFNULL(qa.box_judgement,-1) AS box_judgement"),
                        'm.hs_count_per_box'
                    )
                    ->leftJoin('qa_inspected_boxes as qa', function($join) {
                            $join->on('qa.pallet_id','=','pb.pallet_id');
                            $join->on('pb.id','=','qa.box_id');
                        }
                    )
                    ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                    ->leftJoin('pallet_box_ng_reasons as ng','ng.id', '=', 'qa.remarks')
                    ->where('pb.pallet_id', $pallet_id)
                    ->where('pb.is_deleted', 0)
                    ->orderBy('pb.box_qr', 'desc');
                    
        return $query;

    }

    public function get_serials(Request $req)
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

    public function check_hs_serial(Request $req)
    {

        $data = [
			'msg' => 'Checking of HS Serial has failed.',
            'data' => [
                'matched' => false
            ],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            // HS serials in DB
            $arr_db_serials = [];
            $db_serials = $this->serials($req->box_qr);

            foreach ($db_serials as $key => $hs) {
                array_push($arr_db_serials,str_replace("\r","",$hs->HS_Serial));
            }

            // HS serials were scanned in QA
            $hs_qr = explode(';',$req->hs_qrs);

            // checking if matched
            $matched = 1;
            foreach ($hs_qr as $key => $hs) {
                $hs = trim(str_replace(" ","",preg_replace('/\t+/','',$hs)));

                if (!in_array($hs, $arr_db_serials)) {
                    if ($hs != "" && !is_null($hs) && $hs == 'Enter') {
                        $matched = 0;
                        break;
                    }                    
                }
            }

            $box = QaInspectedBoxes::where([
                        ['pallet_id','=',$req->pallet_id],
                        ['box_id','=',$req->box_id]
                    ])
                    ->select('id')->first();

            $is_box_checked = (is_null($box))? 0 : $box->count();

            $insp = "";
            $saved = 0;

            if ($is_box_checked) {
                $insp = QaInspectedBoxes::find($box->id);
                $insp->box_qr_judgement = $matched;
                $insp->update_user = Auth::user()->id;
                $saved = $insp->update();

            } else {
                $insp = new QaInspectedBoxes();
                $insp->pallet_id = (!isset($req->pallet_id))? "" : $req->pallet_id;
                $insp->box_id = (!isset($req->box_id))? "" : $req->box_id;
                $insp->box_qr = (!isset($req->box_qr))? "" : $req->box_qr;
                $insp->box_qr_judgement = $matched;
                $insp->inspector = $req->inspector;
                $insp->create_user = Auth::user()->id;
                $insp->update_user = Auth::user()->id;
                $saved = $insp->save();
            }

            if ($saved) {
                $box_data = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                                ->select(
                                    'pb.id',
                                    'pb.pallet_id',
                                    'pb.model_id',
                                    'pb.box_qr',
                                    'pb.remarks',
                                    DB::raw("IFNULL(qa.box_qr_judgement,-1) AS box_qr_judgement")
                                )
                                ->leftJoin('qa_inspected_boxes as qa', function($join) {
                                        $join->on('qa.pallet_id','=','pb.pallet_id');
                                        $join->on('pb.id','=','qa.box_id');
                                    }
                                )
                                ->where('pb.pallet_id', $req->pallet_id)
                                ->where('pb.id', $req->box_id)
                                ->distinct()->first();
                $data = [
                    'data' => [
                        'box_data' => $box_data,
                        'matched' => $matched
                    ],
                    'success' => true,
                ];
            }

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [
                    'matched' => false
                ],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }
        return response()->json($data);
    }

    private function serials($box_qr)
    {
        $query = DB::connection('mysql')->table('tboxqrdetails as bqrd')
                    ->select(
                        'bqrd.HS_Serial'
                    )
                    ->join('tboxqr as bqr','bqr.ID','=','bqrd.Box_ID')
                    ->where('bqr.qrBarcode',$box_qr)->get()->toArray();
        return $query;
    }

    public function get_lot_no(Request $req)
    {
        $data = [
            'data' => [],
            'success' => true
        ];

        $arr_boxes = [];
        $boxes = $this->boxes($req->pallet_id)->get();

        foreach ($boxes as $key => $box) {
            array_push($arr_boxes,$box->box_qr);
        }

        $lot_nos = $this->_helpers->lot_no($arr_boxes);

        $data = [
            'data' => $lot_nos,
            'success' => true
        ];

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
        $query = QaAffectedSerial::where([
                    ['pallet_id', '=', $pallet_id],
                    ['box_id', '=', $box_id]
                ])->select([
                    'id',
                    'pallet_id',
                    'box_id',
                    'hs_serial',
                    'is_deleted',
                ]);
                    
        return $query;
    }

    public function get_box_ng_remarks(Request $req)
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
                $results = PalletBoxNgReason::select('id as id','reason as text')->where('is_deleted',0);

                if ($val !== "") {
                    $results->where('reason','like',"%" . $val . "%");
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

    public function box_judgment(Request $req)
    {
        $data = [
			'msg' => 'Judging box has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $insp = QaInspectedBoxes::find($req->qa_id);
            $insp->box_judgement = (int)$req->judgment;
            $insp->update_user = Auth::user()->id;
            if ($insp->update()) {
                $box_data = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                                ->select(
                                    'pb.id',
                                    'pb.pallet_id',
                                    'pb.model_id',
                                    'qa.id as qa_id',
                                    'pb.box_qr',
                                    DB::raw("ng.reason as remarks"),
                                    DB::raw("IFNULL(qa.box_qr_judgement,-1) AS box_qr_judgement"),
                                    DB::raw("IFNULL(qa.box_judgement,-1) AS box_judgement"),
                                    'm.hs_count_per_box'
                                )
                                ->leftJoin('qa_inspected_boxes as qa', function($join) {
                                        $join->on('qa.pallet_id','=','pb.pallet_id');
                                        $join->on('pb.id','=','qa.box_id');
                                    }
                                )
                                ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                                ->leftJoin('pallet_box_ng_reasons as ng','ng.id', '=', 'qa.remarks')
                                ->where('qa.id', $req->qa_id)
                                ->where('pb.is_deleted', 0)
                                ->orderBy('pb.box_qr', 'desc')->first();
                $data = [
                    'msg' => 'Box was successfully judged.',
                    'data' => $box_data,
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

    public function set_box_ng_remarks(Request $req)
    {
        $data = [
			'msg' => 'Setting Box NG reason has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $insp = QaInspectedBoxes::find($req->box_ng_qa_id);
            $insp->remarks = (int)$req->box_ng_reason;
            $insp->update_user = Auth::user()->id;

            if ($insp->update()) {
                $box_data = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                                ->select(
                                    'pb.id',
                                    'pb.pallet_id',
                                    'pb.model_id',
                                    'qa.id as qa_id',
                                    'pb.box_qr',
                                    DB::raw("ng.reason as remarks"),
                                    DB::raw("IFNULL(qa.box_qr_judgement,-1) AS box_qr_judgement"),
                                    DB::raw("IFNULL(qa.box_judgement,-1) AS box_judgement"),
                                    'm.hs_count_per_box'
                                )
                                ->leftJoin('qa_inspected_boxes as qa', function($join) {
                                        $join->on('qa.pallet_id','=','pb.pallet_id');
                                        $join->on('pb.id','=','qa.box_id');
                                    }
                                )
                                ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                                ->leftJoin('pallet_box_ng_reasons as ng','ng.id', '=', 'qa.remarks')
                                ->where('qa.id', $req->box_ng_qa_id)
                                ->where('pb.is_deleted', 0)
                                ->orderBy('pb.box_qr', 'desc')->first();
                $data = [
                    'msg' => 'Box NG reason was successfully set.',
                    'data' => $box_data,
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

    public function scan_hs_serial(Request $req)
    {
        $data = [
			'msg' => 'Scanning HS serial number has failed',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $rules = [
            'hs_serial' => 'unique:qa_affected_serials,hs_serial'
        ];
        $customMessages = [
            'unique' => 'This HS serial was already scanned.',
        ];

        $this->validate($req, $rules, $customMessages);
        
        try {
            $affected = new QaAffectedSerial();

            $affected->pallet_id = $req->pallet_id;
            $affected->box_id = $req->box_id;
            $affected->hs_serial = $req->hs_serial;
            $affected->is_deleted = 0;
            $affected->create_user = Auth::user()->id;
            $affected->update_user = Auth::user()->id;

            if ($affected->save()) {
                $data = [
                    'data' => $affected,
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

    public function get_dispositions(Request $req)
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
                $results = PalletQaDisposition::select('id as id','disposition as text')
                            ->where('is_deleted',0)->where('disposition','<>','FOR OBA');

                if ($val !== "") {
                    $results->where('disposition','like',"%" . $val . "%");
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

    public function set_disposition(Request $req)
    {
        $data = [
			'msg' => "Setting Pallet's Dispoition was failed",
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
            $pallet->pallet_status = $req->pallet_disposition;
            $pallet->disposition_reason = $req->disposition_reason;
            $pallet->update_user = Auth::user()->id;

            if ($pallet->update()) {
                QaHoldLot::where('pallet_id', $req->pallet_id)->delete();

                foreach ($req->lot_no as $key => $lot_no) {
                    QaHoldLot::create([
                        'pallet_id' => $req->pallet_id,
                        'lot_no' => $lot_no,
                        'create_user' => Auth::user()->id,
                        'update_user' => Auth::user()->id,
                    ]);
                }
                $pallet_data = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
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
                    DB::raw("p.updated_at as updated_at"),
                    DB::raw("r.disposition as reason"),
                    DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
                ])
                ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
                ->where('p.pallet_location','=','Q.A.')->first();

                $data = [
                    'msg' => "Pallet was successfully judged.",
                    'data' => $pallet_data,
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

    public function get_disposition_reasons(Request $req)
    {
        $results = [];
        $val = (!isset($req->q))? "" : $req->q;
        $display = (!isset($req->display))? "" : $req->display;
        $addOptionVal = (!isset($req->addOptionVal))? "" : $req->addOptionVal;
        $addOptionText = (!isset($req->addOptionText))? "" : $req->addOptionText;
        $sql_query = (!isset($req->sql_query))? "" : $req->sql_query;
        $disposition_id = (!isset($req->disposition_id))? "" : $req->disposition_id;
        $where = "";

        try {
            if ($addOptionVal != "" && $display == "id&text") {
                array_push($results, [
                    'id' => $addOptionVal,
                    'text' => $addOptionText
                ]);
            }
            
            if ($sql_query == null || $sql_query == "") {
                $results = PalletDispositionReason::select('id as id','reason as text')
                            ->where('is_deleted',0)->where('disposition',$disposition_id);

                if ($val !== "") {
                    $results->where('reason','like',"%" . $val . "%");
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

    public function get_pallet_lot(Request $req)
    {
        $results = [];
        $val = (!isset($req->q))? "" : $req->q;
        $display = (!isset($req->display))? "" : $req->display;
        $addOptionVal = (!isset($req->addOptionVal))? "" : $req->addOptionVal;
        $addOptionText = (!isset($req->addOptionText))? "" : $req->addOptionText;
        $sql_query = (!isset($req->sql_query))? "" : $req->sql_query;
        $pallet_id = (!isset($req->pallet_id))? "" : $req->pallet_id;
        $where = "";

        try {
            if ($addOptionVal != "" && $display == "id&text") {
                array_push($results, [
                    'id' => $addOptionVal,
                    'text' => $addOptionText
                ]);
            }
            
            if ($sql_query == null || $sql_query == "") {

                $arr_boxes = [];
                $boxes = $this->boxes($pallet_id)->get();

                foreach ($boxes as $key => $box) {
                    array_push($arr_boxes,$box->box_qr);
                }

                $hs_serials = DB::connection('mysql')->table('tboxqr as bqr')
                                ->select('bqrd.HS_Serial')
                                ->join('tboxqrdetails as bqrd','bqrd.Box_ID','=','bqr.ID')
                                ->whereIn('bqr.qrBarcode',$arr_boxes);

                $hs_serial_count = $hs_serials->count();

                if ( $hs_serial_count > 0) {
                    $hs_serials = $hs_serials->get();
                    $serials = [];
    
                    foreach ($hs_serials as $key => $hs) {
                        array_push($serials,$hs->HS_Serial);
                    }
    
                    // get data from china DB
                    $results = DB::connection('ftl_china')->table('barcode')
                                ->select('c9 as id','c9 as text')
                                ->whereIn('c4',$serials)
                                ->distinct();
    
                    
                }

                if ($val !== "") {
                    $results->where('c9','like',"%" . $val . "%");
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

    public function transfer_to(Request $req)
    {
        $data = [
			'msg' => "Transferring Pallet has failed.",
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
            $pallet->pallet_location = $req->pallet_location;
            $pallet->update_user = Auth::user()->id;

            $msg = "";

            if ($pallet->update()) {
                if ($req->pallet_location == "PRODUCTION") {
                    $msg = "Pallet ".$pallet->pallet_qr." was successfully transferred.";

                    $content = [
                        'title' => "Pallet Transferred to Production",
                        'message' => "Pallet ".$pallet->pallet_qr." was transferred to Production."
                    ];

                    $pallet_data = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')
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
                                    ->where('p.id', $req->pallet_id)->first();

                    $recepients = $this->_helpers->prod_users();
                    broadcast(new PalletTransferred($content, $pallet_data, $recepients,'/transactions/box-and-pallet/'));
                } else {
                    $msg = "Pallet ".$pallet->pallet_qr." was successfully transferred.";

                    $content = [
                        'title' => "Pallet Transferred to Warehouse",
                        'message' => "Pallet ".$pallet->pallet_qr." was transferred to Production."
                    ];

                    $pallet_data = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')
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
                                    ->where('p.id', $req->pallet_id)->first();

                    $recepients = $this->_helpers->whs_users();
                    broadcast(new PalletTransferred($content, $pallet_data, $recepients,'/transactions/warehouse/'));
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
}
