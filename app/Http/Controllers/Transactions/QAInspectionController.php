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

class QAInspectionController extends Controller
{
    protected $_helpers;

    public function __construct()
    {
        $this->middleware('auth');
        $this->_helpers = new Helpers;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pages = session('pages');
        return view('transactions.qa_inspection', [
            'pages' => $pages,
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
                        'pb.created_at',
                        'pb.updated_at'
                        // ,
                        // 'bqr.qrBarcode',
                        // 'bqrd.HS_Serial'
                    )
                    // ->join('tboxqr as bqr','bqr.qrBarcode','=','pb.box_qr')
                    // ->join('tboxqrdetails as bqrd','bqr.ID','=','bqrd.Box_ID')
                    ->where('pb.pallet_id',$pallet_id)
                    ->orderBy('pb.box_qr','desc');
                    //->get();
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
            $hs_qr = explode(';\r',$req->hs_qrs);

            // checking if matched
            $matched = true;
            foreach ($hs_qr as $key => $hs) {
                if (!in_array($hs, $arr_db_serials)) {
                    $matched = false;
                    break;
                }
            }

            if (!$matched) {
                $data = [
                    'data' => [
                        'matched' => false
                    ],
                    'success' => true,
                ];
            } else {
                $data = [
                    'data' => [
                        'matched' => true
                    ],
                    'success' => true,
                ];
            }
        } catch (\Throwable $th) {
            //throw $th;
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
}
