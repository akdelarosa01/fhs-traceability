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
use App\Models\QaAffectedSerial;
use App\Models\QaInspectedBoxes;
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
                DB::raw("p.updated_at as updated_at")
            ])
            ->join('pallet_model_matrices as m','p.model_id','=','m.id')
            ->where([
                ['p.pallet_status','=','1'],
                ['p.pallet_location','=','Q.A.']
            ]);

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
                        'pb.box_qr',
                        'pb.remarks',
                        DB::raw("IFNULL(qa.box_qr_judgement,-1) AS box_qr_judgement")
                    )
                    ->leftJoin('qa_inspected_boxes as qa', function($join) {
                            $join->on('qa.pallet_id','=','pb.pallet_id');
                            $join->on('pb.id','=','qa.box_id');
                        }
                    )
                    ->where('pb.pallet_id',$pallet_id)
                    ->where('pb.is_deleted',0)
                    ->orderBy('pb.box_qr','desc')
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
            $insp = new QaInspectedBoxes();

            
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
                    if ($hs != "" && !is_null($hs)) {
                        $matched = 0;
                        break;
                    }                    
                }
            }

            if (!$matched) {
                $data = [
                    'data' => [
                        'matched' => 0
                    ],
                    'success' => true,
                ];
            } else {
                $data = [
                    'data' => [
                        'matched' => 1
                    ],
                    'success' => true,
                ];
            }

            $insp->pallet_id = (!isset($req->pallet_id))? "" : $req->pallet_id;
            $insp->box_id = (!isset($req->box_id))? "" : $req->box_id;
            $insp->box_qr = (!isset($req->box_qr))? "" : $req->box_qr;
            $insp->created_at = (!isset($req->created_date))? "" : $req->created_date;
            $insp->box_qr_judgement = $matched;
            // $insp->where($insp->box_qr , $req->box_qr);
            $insp->save();

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
}
