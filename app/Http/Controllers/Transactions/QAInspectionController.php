<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Events\PalletTransferred;
use App\Models\PalletHeatSinkNgReason;
use App\Models\PalletBoxPalletDtl;
use App\Models\PalletBoxPalletHdr;
use App\Models\PalletDispositionReason;
use App\Models\PalletPrintPalletLabel;
use App\Models\PalletQaDisposition;
use App\Models\QaAffectedSerial;
use App\Models\QaChangeJudgmentReason;
use App\Models\QaHoldLot;
use App\Models\QaHoldPallet;
use App\Models\QaInspectedBoxes;
use App\Models\QaInspectionSheetSerial;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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
        $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
            DB::raw("p.id as id"),
            DB::raw("p.model_id as model_id"),
            DB::raw("m.model as model"),
            DB::raw("p.transaction_id as transaction_id"),
            DB::raw("CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status"),
            DB::raw("p.pallet_status as pallet_dispo_status"),
            DB::raw("qad.disposition as disposition"),
            DB::raw("qad.color_hex as color_hex"),
            DB::raw("p.pallet_qr as pallet_qr"),
            DB::raw("p.new_box_count as new_box_count"),
            DB::raw("p.pallet_location as pallet_location"),
            DB::raw("p.is_printed as is_printed"),
            DB::raw("ifnull(p.new_box_to_inspect,m.box_count_to_inspect) as box_count_to_inspect"),
            DB::raw("p.created_at as created_at"),
            DB::raw("p.updated_at as updated_at"),
            DB::raw("r.disposition as reason"),
            DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
        ])
        ->join('pallet_model_matrices as m','p.model_id','=','m.id')
        ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
        ->leftJoin('pallet_qa_dispositions as qad','p.pallet_status','=','qad.id')
        ->where('p.pallet_location','=','Q.A.');

        return Datatables::of($query)->make(true);
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
                        DB::raw("IF(qa.box_qr is null, 0, 1) scanned")
                    )
                    ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                    ->leftJoin('qa_inspection_sheet_serials as qa','qa.box_id', '=', 'pb.id')
                    ->where('pb.pallet_id', $pallet_id)
                    ->where('pb.is_deleted', 0)
                    ->orderBy('pb.box_qr', 'desc')
                    ->distinct();
                    
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

    public function get_inspection_sheet_serials(Request $req)
    {
        $query = DB::connection('mysql')->table('qa_inspection_sheet_serials')
                    ->where('box_id',$req->box_id)->distinct();
        return Datatables::of($query)->make(true);
    }

    public function check_inspection_sheet(Request $req)
    {
        $data = [
			'msg' => 'Checking of Inspection Sheet QR has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            // HS serials in DB
            $arr_db_serials = [];
            $output_serial = [];
            $db_serials = $this->serials($req->box_qr);

            foreach ($db_serials as $key => $hs) {
                array_push($arr_db_serials,str_replace("\r","",$hs->HS_Serial));
            }

            // HS serials were scanned in QA
            $hs_serial = explode(';',$req->inspection_sheet_qr);

            // checking if matched
            $matched = 1;

            DB::beginTransaction();
            $hs_dt = DB::connection('ftl_china')->table('barcode')
                            ->whereIn('c4',$hs_serial)
                            ->select(
                                DB::raw("c1 as prod_date"),
                                DB::raw("c4 as serial"),
                                DB::raw("c6 as operator"),
                                DB::raw("c8 as work_order")
                            )->get();

            foreach ($hs_serial as $key => $hs) {
                $hs = trim(str_replace(" ","",preg_replace('/\t+/','',$hs)));

                if (!in_array($hs, $arr_db_serials)) {
                    if ($hs != "" && !is_null($hs) && $hs !== 'Enter') {
                        $matched = 0;
                        break;
                    }
                }

                $check = QaInspectionSheetSerial::where('box_id',$req->box_id)->where('hs_serial',$hs)->count();

                if ($check < 1) {
                    foreach ($hs_dt as $key => $pkg) {
                        if ($hs == $pkg->serial) {
                            array_push($output_serial, [
                                'box_id' => $req->box_id,
                                'box_qr' => $req->box_qr,
                                'hs_serial' => $hs,
                                'prod_date' => $pkg->prod_date,
                                'operator' => $pkg->operator,
                                'work_order' => $pkg->work_order,
                                'create_user' => Auth::user()->id,
                                'update_user' => Auth::user()->id,
                                'created_at' => date('Y-m-d H:i:s'),
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                            break;
                        }
                    }
                }
            }

            if (count($output_serial) > 0) {
                $insert = array_chunk($output_serial, 1000);

                $saved = false;
                foreach ($insert as $batch) {
                    $saved = DB::connection('mysql')->table('qa_inspection_sheet_serials')->insert($batch);
                }
            }

            if ($matched > 0) {
                // save box details
                QaInspectedBoxes::create([
                    'pallet_id' => $req->pallet_id,
                    'box_id' => $req->box_id,
                    'box_qr' => $req->box_qr,
                    'date_manufactured' => $req->date_manufactured,
                    'date_expired' => $req->date_expired,
                    'customer_pn' => $req->customer_pn,
                    'lot_no' => $req->lot_no,
                    'prod_line_no' => $req->prod_line_no,
                    'carton_no' => $req->carton_no,
                    'qty_per_box' => $req->qty_per_box,
                    'inspector' => $req->inspector,
                    'shift' => $req->shift,
                    'inspection_sheet_qr' => $req->inspection_sheet_qr,
                    'create_user' => Auth::user()->id,
                    'update_user' => Auth::user()->id
                ]);

                $box = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                            ->select(
                                DB::raw("pb.id as id"),
                                DB::raw("pb.pallet_id as pallet_id"),
                                DB::raw("pb.model_id as model_id"),
                                DB::raw("pb.box_qr as box_qr"),
                                DB::raw("pb.remarks as prod_remarks"),
                                DB::raw("'' as remarks"),
                                DB::raw("IFNULL(pb.box_judgment,-1) AS box_judgement"),
                                DB::raw("m.hs_count_per_box as hs_count_per_box"),
                                DB::raw("IF(qa.box_qr is null, 0, 1) scanned")
                            )
                            ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                            ->leftJoin('qa_inspection_sheet_serials as qa','qa.box_id', '=', 'pb.id')
                            ->where('pb.pallet_id', $req->pallet_id)
                            ->where('pb.id', $req->box_id)
                            ->where('pb.is_deleted', 0)
                            ->orderBy('pb.box_qr', 'desc')
                            ->distinct()
                            ->first();
                $data = [
                    'data' => [
                        'output_serial' => $output_serial,
                        'box' => $box
                    ],
                    'success' => true
                ];

                DB::commit();
            } else {
                $data = [
                    'msg' => 'Inspection Sheet is not matched with Box ID ['.$req->box_qr.']',
                    'data' => [],
                    'success' => true,
                    'msgType' => 'warning',
                    'msgTitle' => 'Failed!'
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

    private function serials($box_qr)
    {
        $query = DB::connection('mysql')
                    ->select("SELECT case when f.c10 <> '' and f.c10 is not null then f.c4 else f.c4 end as HS_Serial
                            FROM furukawa.tinspectionsheetprintdata as b
                            join formal.barcode as f
                            on CASE WHEN right(b.BoxSerialNo,1) = 'R' then SUBSTRING(b.BoxSerialNo,-4,3) else right(b.BoxSerialNo,3) end = LPAD(f.c7,3,'0')
                            and f.c3 = LEFT(b.BoxSerialNo,LENGTH(f.c3))
                            and b.lot_no = f.c9
                            where b.BoxSerialNo = '".$box_qr."R'");
        if (count((array)$query) == 0) {
            $query = DB::connection('mysql')
                    ->select("SELECT case when f.c10 <> '' and f.c10 is not null then f.c4 else f.c4 end as HS_Serial
                            FROM furukawa.tinspectionsheetprintdata as b
                            join formal.barcode as f
                            on CASE WHEN right(b.BoxSerialNo,1) = 'R' then SUBSTRING(b.BoxSerialNo,-4,3) else right(b.BoxSerialNo,3) end = LPAD(f.c7,3,'0')
                            and f.c3 = LEFT(b.BoxSerialNo,LENGTH(f.c3))
                            and b.lot_no = f.c9
                            where b.BoxSerialNo = '".$box_qr."'");
        }
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

        $lot_nos = DB::connection('mysql')->table('tinspectionsheetprintdata')
            ->whereIn('BoxSerialNo',$arr_boxes)
            ->select('lot_no')
            ->distinct()
            ->get();

        // $lot_nos = $this->_helpers->lot_no($arr_boxes);

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

    public function get_hs_ng_remarks(Request $req)
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
                $results = PalletHeatSinkNgReason::select('id as id','reason as text')->where('is_deleted',0);

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

    public function hs_serial_judgment(Request $req)
    {
        $data = [
			'msg' => 'Judging HS Serial has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $data = $req->row_data;
            $error = 0;
            $count = 0;

            foreach ($data as $key => $qa) {
                $count++;
                $insp = QaAffectedSerial::find($qa['id']);
                $insp->pallet_id = $qa['pallet_id'];
                $insp->box_id = $qa['box_id'];
                $insp->hs_serial = $qa['hs_serial'];
                $insp->qa_judgment = (int)$req->judgment;
                $insp->remarks = ((int)$req->judgment == 1)? null : $qa['remarks'];
                $insp->update_user = Auth::user()->id;

                if ($insp->update()) {
                    $inspected = QaAffectedSerial::where('box_id', $qa['box_id'])->where('qa_judgment','<>',-1);

                    if ($inspected->count() == $req->hs_count) {
                        $inspected = $inspected->get();

                        $box_judgment = 1;
                        foreach ($inspected as $key => $ins) {
                            if ($ins->qa_judgment == 0) {
                                $box_judgment = 0;
                                break;
                            }
                        }

                        $box = PalletBoxPalletDtl::find($qa['box_id']);
                        $box->box_judgment = $box_judgment;
                        $box->update_user = Auth::user()->id;
                        $box->update();
                    }
                } else {
                    $error++;
                }
            }

            if ($error < 1) {
                $msg = "HS Serial was successfully judged.";
                if ($count > 1) {
                    $msg = "HS Serials were successfully judged.";
                }

                $data = [
                    'msg' => $msg,
                    'data' => $insp,
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

    public function set_hs_ng_remarks(Request $req)
    {
        $data = [
			'msg' => 'Setting Heat Sink NG reason has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $insp = QaAffectedSerial::find($req->id);
            $insp->qa_judgment = (int)$req->judgment;
            $insp->remarks = $this->_helpers->getHSdefects($req->hs_ng_reason);
            $insp->update_user = Auth::user()->id;

            if ($insp->update()) {
                $inspected = QaAffectedSerial::where('box_id', (int)$req->hs_ng_box_id)->where('qa_judgment','<>',-1);

                $count = $inspected->count();
                $hs_count = (int)$req->hs_count;

                if ($inspected->count() == (int)$req->hs_count) {
                    $inspected = $inspected->get();
                    $box_judgment = 1;
                    foreach ($inspected as $key => $ins) {
                        if ($ins->qa_judgment == 0) {
                            $box_judgment = 0;
                            break;
                        }
                    }

                    $box = PalletBoxPalletDtl::find($req->hs_ng_box_id);
                    $box->box_judgment = $box_judgment;
                    $box->update_user = Auth::user()->id;
                    $box->update();
                }

                $data = [
                    'msg' => 'Heat Sink NG reason was successfully set.',
                    'data' => $insp,
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

        
        
        try {
            if (isset($req->type) ) {
                $rules = [
                    'hs_serial' => [
                        Rule::exists('qa_inspection_sheet_serials')->where(function ($query) use ($req) {
                            $query->where('hs_serial', $req->hs_serial)->where('box_id', $req->box_id);
                        })
                    ]
                ];
                $customMessages = [
                    'exists' => 'This HS serial is not included in Inspection Sheet QR.'
                ];
        
                $this->validate($req, $rules, $customMessages);

                $data = $this->hs_judgment_change($req);
            } else {
                $rules = [
                    'hs_serial' => [
                        Rule::exists('qa_inspection_sheet_serials')->where(function ($query) use ($req) {
                            $query->where('hs_serial', $req->hs_serial)->where('box_id', $req->box_id);
                        }),
                        Rule::unique('qa_affected_serials')->where(function ($query) use ($req) {
                            return $query->where([
                                ['hs_serial', '=', $req->hs_serial],
                                ['box_id', '=', (int)$req->box_id],
                                ['pallet_id', '=', (int)$req->pallet_id],
                                ['is_deleted','=', 0]
                            ]);
                        })
                    ]
                ];
                $customMessages = [
                    'unique' => 'This HS serial was already scanned.',
                    'exists' => 'This HS serial is not included in Inspection Sheet QR.'
                ];
        
                $this->validate($req, $rules, $customMessages);

                $data = $this->hs_judgment($req);
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

    private function hs_judgment($req)
    {
        try {
            $hs = QaAffectedSerial::where([
                ['hs_serial','=',$req->hs_serial]
            ])->count();

            $qa_judgement_count = $hs+1;
            $remarks = "";

            DB::beginTransaction();
            $affected = new QaAffectedSerial();
            $affected->pallet_id = $req->pallet_id;
            $affected->box_id = $req->box_id;
            $affected->hs_serial = $req->hs_serial;
            $affected->qa_judgment = (int)$req->judgment;

            if ((int)$req->judgment == 0) {
                $remarks = $this->_helpers->getHSdefects($req->hs_ng_reason);
            }

            $affected->remarks = $remarks;
            $affected->is_deleted = 0;
            $affected->qa_judgement_count = $qa_judgement_count;
            $affected->create_user = Auth::user()->id;
            $affected->update_user = Auth::user()->id;

            $matched = 'NOT YET COMPLETE';
            if ($affected->save()) {
                $inspected = QaAffectedSerial::where('box_id', $req->box_id)->where('hs_serial','<>',"");
                $serials = QaInspectionSheetSerial::where('box_id',$req->box_id)->where('hs_serial','<>',"")->select('hs_serial','box_qr','box_id')->distinct()->get()->toArray();

                if (isset($req->hs_ng_type)) {
                    $ch = DB::connection('mysql')
                            ->table('qa_change_judgment_reasons')
                            ->insert([
                                'pallet_id' => $req->pallet_id,
                                'box_id' => $req->box_id,
                                'hs_serial' => $req->hs_serial,
                                'orig_judgment' => $req->orig_judgment,
                                'new_judgment' => $req->new_judgment,
                                'reason' => $req->reason,
                                'create_user' => Auth::user()->id,
                                'created_at' => date('Y-m-d H:i:s')
                            ]);
                    if ($ch) {
                        $insp = QaAffectedSerial::find($affected->id);
                        $insp->qa_judgment = (int)$req->new_judgment;
                        $insp->update();
                    }
                }

                $inspected_count = $inspected->count();
                $serials_count = count($serials);

                if ($inspected_count >= $serials_count) {
                    // $serials = $serials->get();
                    $inspected = $inspected->get()->toArray();

                    $box_judgment = 1;
                    foreach ($inspected as $key => $ins) {
                        if ($ins['qa_judgment'] == 0) {
                            $box_judgment = 0;
                            break;
                        }
                    }

                    $box = PalletBoxPalletDtl::find($req->box_id);
                    $box->box_judgment = $box_judgment;
                    $box->update_user = Auth::user()->id;
                    $box->update();

                    $matched = true;
                    foreach ($serials as $key => $iss) {
                        if (!in_array($iss['hs_serial'], $inspected)) {
                            $matched = false;
                            break;
                        }
                    }
                }

                $box = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                        ->select(
                            DB::raw("pb.id as id"),
                            DB::raw("pb.pallet_id as pallet_id"),
                            DB::raw("pb.model_id as model_id"),
                            DB::raw("pb.box_qr as box_qr"),
                            DB::raw("pb.remarks as prod_remarks"),
                            DB::raw("'' as remarks"),
                            DB::raw("IFNULL(pb.box_judgment,-1) AS box_judgement"),
                            DB::raw("m.hs_count_per_box as hs_count_per_box"),
                            DB::raw("IF(qa.box_qr is null, 0, 1) scanned")
                        )
                        ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                        ->leftJoin('qa_inspection_sheet_serials as qa','qa.box_id', '=', 'pb.id')
                        ->where('pb.id', $req->box_id)
                        ->where('pb.is_deleted', 0)
                        ->orderBy('pb.box_qr', 'desc')
                        ->distinct()->first();
                
                $data = [
                    'data' => [
                        'affected_serials' => $affected,
                        'matched' => $matched,
                        'box' => $box
                    ],
                    'success' => true
                ];

                DB::commit();
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

        return $data;
    }

    private function hs_judgment_change($req)
    {
        try {
            $hs = QaAffectedSerial::where([
                ['hs_serial','=',$req->hs_serial]
            ])->count();

            $qa_judgement_count = $hs+1;
            $remarks = "";

            DB::beginTransaction();

            $affected = QaAffectedSerial::find($req->hs_id);
            $affected->pallet_id = $req->pallet_id;
            $affected->box_id = $req->box_id;
            $affected->hs_serial = $req->hs_serial;
            $affected->qa_judgment = (int)$req->new_judgment;

            if ((int)$req->new_judgment == 0) {
                $remarks = $this->_helpers->getHSdefects($req->hs_ng_reason);
            }

            $affected->remarks = $remarks;
            $affected->is_deleted = 0;
            $affected->qa_judgement_count = $qa_judgement_count;
            $affected->update_user = Auth::user()->id;

            $matched = 'NOT YET COMPLETE';
            if ($affected->update()) {
                DB::connection('mysql')
                    ->table('qa_change_judgment_reasons')
                    ->insert([
                        'pallet_id' => $req->pallet_id,
                        'box_id' => $req->box_id,
                        'hs_serial' => $req->hs_serial,
                        'orig_judgment' => $req->orig_judgment,
                        'new_judgment' => $req->new_judgment,
                        'reason' => $req->reason,
                        'create_user' => Auth::user()->id,
                        'created_at' => date('Y-m-d H:i:s')
                    ]);

                $inspected = QaAffectedSerial::where('box_id', $req->box_id)->where('hs_serial','<>',"");
                $serials = QaInspectionSheetSerial::where('box_id',$req->box_id)->where('hs_serial','<>',"")->select('hs_serial','box_qr','box_id')->distinct()->get()->toArray();

                $inspected_count = $inspected->count();
                $serials_count = count($serials);

                if ($inspected_count >= $serials_count) {
                    // $serials = $serials->get();
                    $inspected = $inspected->get()->toArray();

                    $box_judgment = 1;
                    foreach ($inspected as $key => $ins) {
                        if ($ins['qa_judgment'] == 0) {
                            $box_judgment = 0;
                            break;
                        }
                    }

                    $box = PalletBoxPalletDtl::find($req->box_id);
                    $box->box_judgment = $box_judgment;
                    $box->update_user = Auth::user()->id;
                    $box->update();

                    $matched = true;
                    foreach ($serials as $key => $iss) {
                        if (!in_array($iss['hs_serial'], $inspected)) {
                            $matched = false;
                            break;
                        }
                    }
                }

                $box = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                        ->select(
                            DB::raw("pb.id as id"),
                            DB::raw("pb.pallet_id as pallet_id"),
                            DB::raw("pb.model_id as model_id"),
                            DB::raw("pb.box_qr as box_qr"),
                            DB::raw("pb.remarks as prod_remarks"),
                            DB::raw("'' as remarks"),
                            DB::raw("IFNULL(pb.box_judgment,-1) AS box_judgement"),
                            DB::raw("m.hs_count_per_box as hs_count_per_box"),
                            DB::raw("IF(qa.box_qr is null, 0, 1) scanned")
                        )
                        ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                        ->leftJoin('qa_inspection_sheet_serials as qa','qa.box_id', '=', 'pb.id')
                        ->where('pb.id', $req->box_id)
                        ->where('pb.is_deleted', 0)
                        ->orderBy('pb.box_qr', 'desc')
                        ->distinct()
                        ->first();
                
                $data = [
                    'msg' => 'Changing of Judgment was successful.',
                    'data' => [
                        'affected_serials' => $affected,
                        'matched' => $matched,
                        'box' => $box
                    ],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];

                DB::commit();
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

        return $data;
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

                switch ($req->pallet_disposition) {
                    case '5':
                        QaHoldLot::where('pallet_id', $req->pallet_id)->delete();
                        QaHoldPallet::where('pallet_id', $req->pallet_id)->delete();

                        foreach ($req->lot_no as $key => $lot_no) {
                            QaHoldLot::create([
                                'pallet_id' => $req->pallet_id,
                                'lot_no' => $lot_no,
                                'create_user' => Auth::user()->id,
                                'update_user' => Auth::user()->id,
                            ]);
                        }
                        break;
                    case '4':
                        QaHoldLot::where('pallet_id', $req->pallet_id)->delete();
                        QaHoldPallet::where('pallet_id', $req->pallet_id)->delete();

                        QaHoldPallet::create([
                            'pallet_id' => $req->pallet_id,
                            'create_user' => Auth::user()->id,
                            'update_user' => Auth::user()->id,
                        ]);
                        break;
                    
                    default:
                        QaHoldLot::where('pallet_id', $req->pallet_id)->delete();
                        QaHoldPallet::where('pallet_id', $req->pallet_id)->delete();
                        break;
                }
                
                $pallet_data = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
                    DB::raw("p.id as id"),
                    DB::raw("p.model_id as model_id"),
                    DB::raw("m.model as model"),
                    DB::raw("p.transaction_id as transaction_id"),
                    DB::raw("CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status"),
                    DB::raw("p.pallet_status as pallet_dispo_status"),
                    DB::raw("qad.disposition as disposition"),
                    DB::raw("qad.color_hex as color_hex"),
                    DB::raw("p.pallet_qr as pallet_qr"),
                    DB::raw("p.new_box_count as new_box_count"),
                    DB::raw("p.pallet_location as pallet_location"),
                    DB::raw("p.is_printed as is_printed"),
                    DB::raw("ifnull(p.new_box_to_inspect,m.box_count_to_inspect) as box_count_to_inspect"),
                    DB::raw("p.created_at as created_at"),
                    DB::raw("p.updated_at as updated_at"),
                    DB::raw("r.disposition as reason"),
                    DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
                ])
                ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
                ->leftJoin('pallet_qa_dispositions as qad','p.pallet_status','=','qad.id')
                ->where('p.id','=',$req->pallet_id)->first();

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

                $results = DB::connection('mysql')->table('tinspectionsheetprintdata')
                        ->whereIn('BoxSerialNo',$arr_boxes)
                        ->select('lot_no as id','lot_no as text')
                        ->distinct();

                // $hs_serials = DB::connection('mysql')->table('tboxqr as bqr')
                //                 ->select('bqrd.HS_Serial')
                //                 ->join('tboxqrdetails as bqrd','bqrd.Box_ID','=','bqr.ID')
                //                 ->whereIn('bqr.qrBarcode',$arr_boxes);

                // $hs_serial_count = $hs_serials->count();

                // if ( $hs_serial_count > 0) {
                //     $hs_serials = $hs_serials->get();
                //     $serials = [];
    
                //     foreach ($hs_serials as $key => $hs) {
                //         array_push($serials,$hs->HS_Serial);
                //     }
    
                //     // get data from china DB
                //     $results = DB::connection('ftl_china')->table('barcode')
                //                 ->select('c9 as id','c9 as text')
                //                 ->whereIn('c4',$serials)
                //                 ->distinct();
    
                    
                // }

                if ($val !== "") {
                    // $results->where('c9','like',"%" . $val . "%");
                    $results->where('lot_no','like',"%" . $val . "%");
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

    public function get_box_details(Request $req)
    {
        $data = [
			'msg' => "Getting Box details has failed.",
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $query = DB::table('pallet_box_pallet_dtls as b')
                        ->join('pallet_model_matrices as m','m.id','=','b.model_id')
                        ->join('tinspectionsheetprintdata as o','o.BoxSerialNo','=','b.box_qr')
                        ->select(
                            DB::raw('b.id as id'),
                            DB::raw('m.model as model'),
                            DB::raw("str_to_date(o.production_date,'%d-%b-%y') as date_manufactured"),
                            DB::raw("date_add(str_to_date(o.production_date,'%d-%b-%y'), interval 730 DAY) as date_expired"),
                            DB::raw('o.cust_part_no as cust_part_no'),
                            DB::raw('o.lot_no as lot_no'),
                            DB::raw('o.machine as prod_line_no'),
                            DB::raw('o.test_result as carton_label_no'),
                            DB::raw('m.hs_count_per_box as qty_per_box')
                        )
                        ->where('b.box_qr', $req->box_qr);

            if ($query->count()) {
                $data = [
                    'data' => $query->first(),
                    'success' => true,
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

    public function set_shift(Request $req)
    {
        $data = [
			'msg' => "Setting Shift has failed.",
            'data' => [
                'shift' => ''
            ],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $shift = $req->shift;

            $req->session()->forget('shift');
            $req->session()->put('shift', $shift);

            $data = [
                'msg' => "Setting Shift was successful.",
                'data' => [
                    'shift' => $shift
                ],
                'success' => true,
                'msgType' => 'success',
                'msgTitle' => 'Success!'
            ];

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [
                    'shift' => ''
                ],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function set_new_box_to_inspect(Request $req)
    {
        $data = [
			'msg' => "Setting number of Box to Inspect has failed.",
            'data' => [
                'pallet' => '',
                'box_count_to_inspect' => ''
            ],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $pallet_id = $req->pallet_id;
            $new_box_to_inspect = $req->box_count_to_inspect;

            $pallet = PalletBoxPalletHdr::find($pallet_id);
            $pallet->new_box_to_inspect = $new_box_to_inspect;

            if ($pallet->update()) {
                $pallet_data = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
                                    DB::raw("p.id as id"),
                                    DB::raw("p.model_id as model_id"),
                                    DB::raw("m.model as model"),
                                    DB::raw("p.transaction_id as transaction_id"),
                                    DB::raw("CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status"),
                                    DB::raw("p.pallet_status as pallet_dispo_status"),
                                    DB::raw("qad.disposition as disposition"),
                                    DB::raw("qad.color_hex as color_hex"),
                                    DB::raw("p.pallet_qr as pallet_qr"),
                                    DB::raw("p.new_box_count as new_box_count"),
                                    DB::raw("p.pallet_location as pallet_location"),
                                    DB::raw("p.is_printed as is_printed"),
                                    DB::raw("ifnull(p.new_box_to_inspect,m.box_count_to_inspect) as box_count_to_inspect"),
                                    DB::raw("p.created_at as created_at"),
                                    DB::raw("p.updated_at as updated_at"),
                                    DB::raw("r.disposition as reason"),
                                    DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
                                ])
                                ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                                ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
                                ->leftJoin('pallet_qa_dispositions as qad','p.pallet_status','=','qad.id')
                                ->where('p.id','=',$pallet_id)
                                ->first();

                $data = [
                    'msg' => "Setting number of Box to Inspect was successful.",
                    'data' => [
                        'pallet' => $pallet_data,
                        'box_count_to_inspect' => $new_box_to_inspect
                    ],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }            

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [
                    'pallet' => '',
                    'box_count_to_inspect' => ''
                ],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function get_hs_history(Request $req)
    {
        $data = [];
        try {
            $query = $this->serial_history($req->hs_serial,$req->lot_no);
            return Datatables::of($query)->make(true);

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    private function serial_history($hs_serial,$lot_no)
    {
        $query = DB::connection('mysql')
                    ->table('formal.barcode')
                    ->select(
                        DB::raw("case when c10 <> '' and c10 is not null then c10 else c4 end as old_serial"),
                        DB::raw("case when c10 <> '' and c10 is not null then c4 else '' end as new_serial")
                    )
                    ->where('c9',$lot_no)
                    ->where('c10',$hs_serial)
                    ->orWhere('c4',$hs_serial)
                    ->limit(1)->distinct()
                    ->get();
        return $query;
    }

    public function get_box_history(Request $req)
    {
        $data = [];
        try {
            $query = DB::select("SELECT p.pallet_qr as pallet_qr,
                                b.box_qr as box_qr,
                                qa.qa_judgment as qa_judgment,
                                qa.remarks as remarks,
                                qa.updated_at as updated_at
                            FROM qa_affected_serials as qa
                            JOIN pallet_box_pallet_hdrs as p
                            on p.id = qa.pallet_id
                            JOIN pallet_box_pallet_dtls as b
                            on b.id = qa.box_id
                            where qa.hs_serial = '".$req->hs_serial."'");
            return Datatables::of($query)->make(true);

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    public function check_all_scanned_box(Request $req)
    {
        $data = [
			'msg' => "Please Scan all Inspection Sheet before assigning disposition.",
            'data' => [
                'is_scanned_all' => false
            ],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $scanned = false;
            $boxes = $this->boxes($req->pallet_id);
            $boxes = $boxes->get();

            foreach ($boxes as $key => $box) {
                $ins_boxes = DB::table('qa_inspection_sheet_serials')
                                ->where('box_id',$box->id)->count();
                if ($ins_boxes > 0) {
                    $scanned = true;
                } else {
                    $scanned = false;
                    break;
                }
            }

            $data = [
                'data' => [
                    'is_scanned_all' => $scanned
                ],
                'success' => true,
            ];

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [
                    'is_scanned_all' => false
                ],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
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
            $box_qr = explode(";\n",$req->box_qr);

            for ($i=0; $i < count($box_qr); $i++) { 
                $box_qr[$i] = str_replace(";","",$box_qr[$i]);
            }

            // $lot_nos = $this->_helpers->lot_no($box_qr);
            $lot_nos = DB::connection('mysql')->table('tinspectionsheetprintdata')
                            ->whereIn('BoxSerialNo',$box_qr)
                            ->select('lot_no')
                            ->distinct()
                            ->get();
            $lots = "";

            foreach ($lot_nos as $key => $lot) {
                $lots .= $lot->lot_no."; ";
            }

            $print_date = date('Y-m-d');
            $month = $req->month;

            $pallet = PalletBoxPalletHdr::find($req->pallet_id);
            $pallet->is_printed = 1;
            $pallet->update_user = Auth::user()->id;

            if ($req->mode == 'print') {
                // $pallet->pallet_status = 1; // FOR OBA
                $pallet->print_date = $print_date;
            } else { // reprint
                $print_date = date('Y/m/d',strtotime($pallet->print_date));
                $month = strtoupper(date('M',strtotime($pallet->print_date)));
            }

            if ($pallet->update()) {

                // insert into the Bartender Table

                $print = DB::connection('mysql')->table($req->printer)
                            ->insert([
                                'month' => $month,
                                'model' => $req->model,
                                'lot_no' => $lots,
                                'box_qty' => $req->box_qty,
                                'box_qr' => $req->box_qr,
                                'pallet_qr' => $req->pallet_qr,
                                'print_date' => $print_date,
                            ]);

                if ($print) {
                    $query = DB::connection('mysql')->table('pallet_transactions as t')
                                ->select([
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

    public function get_change_judgment_reasons(Request $req)
    {
        $data = [];
        try {
            $query = DB::select(
                        DB::raw("SELECT p.pallet_qr as pallet_qr,
                                b.box_qr as box_qr,
                                jd.hs_serial as hs_serial,
                                jd.orig_judgment as orig_judgment,
                                jd.new_judgment as new_judgment,
                                jd.reason as reason,
                                u.firstname as create_user,
                                jd.created_at as created_at
                            FROM qa_change_judgment_reasons as jd
                            JOIN pallet_box_pallet_hdrs as p
                            ON p.id = jd.pallet_id
                            JOIN pallet_box_pallet_dtls as b
                            ON b.id = jd.box_id
                            JOIN users as u
                            ON u.id = jd.create_user
                            where jd.box_id = ".$req->box_id)
                    );
            return Datatables::of($query)->make(true);

        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data; 
    }
}