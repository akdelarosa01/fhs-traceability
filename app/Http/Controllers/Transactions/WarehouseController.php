<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Events\PalletTransferred;
use App\Models\PalletCustomer;
use App\Models\PalletBoxPalletHdr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class WarehouseController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'Warehouse');

        return view('transactions.warehouse', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('transactions.warehouse')
        ]);
    }

    public function get_customer_destinations(Request $req)
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
                $results = PalletCustomer::select(
                                DB::raw("id as id"),
                                DB::raw("CONCAT(customer_name, ' | ' ,`address`) as text")
                            )
                            ->where('is_deleted',0);

                if ($val !== "") {
                    $results->where(DB::raw("CONCAT(customer_name, ' | ' ,`address`)"),'like',"%" . $val . "%");
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

    public function get_model_for_ship()
    {
        $data = [];
        try {
            $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
                        // DB::raw("p.id as id"),
                        // DB::raw("p.transaction_id as transaction_id"),
                        // DB::raw("p.pallet_qr as pallet_qr"),
                        DB::raw("p.model_id as model_id"),
                        DB::raw("m.model as model"),
                    ])
                    ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                    ->where('p.pallet_location','WAREHOUSE')
                    ->distinct();

            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }

    public function get_pallets(Request $req)
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
        ->where('p.pallet_location','=','WAREHOUSE')
        ->where('p.model_id', $req->model_id);

        return Datatables::of($query)->make(true);
    }

    public function get_boxes(Request $req)
    {
        $data = [
            'data' => [],
            'success' => true
        ];

        try {
            $query = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                    ->select(
                        DB::raw("pb.id as id"),
                        DB::raw("pb.pallet_id as pallet_id"),
                        DB::raw("pb.model_id as model_id"),
                        DB::raw("pb.box_qr as box_qr"),
                        DB::raw("pb.remarks as prod_remarks"),
                        DB::raw("'' as remarks"),
                        DB::raw("IFNULL(pb.box_judgment, -1) AS box_judgement"),
                        DB::raw("m.hs_count_per_box as hs_count_per_box"),
                        DB::raw("IF(qa.box_qr is null, 0, 1) as scanned"),
                        DB::raw("IFNULL(qa.scan_count, 0) as scan_count")
                    )
                    ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                    ->leftJoin(DB::raw("(SELECT COUNT(box_qr) as scan_count, box_qr, box_id 
                                        from qa_inspection_sheet_serials group by box_qr, box_id) as qa"),'qa.box_id', '=', 'pb.id')
                    ->where('pb.pallet_id', $req->pallet_id)
                    ->where('pb.is_deleted', 0)
                    ->orderBy('pb.box_qr', 'desc')
                    ->distinct()
                    ->get();

            $data = [
                'data' => $query,
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
                if ($req->pallet_location == "Q.A.") {
                    $msg = "Pallet ".$pallet->pallet_qr." was successfully transferred.";

                    $content = [
                        'title' => "Pallet Transferred to Q.A.",
                        'message' => "Pallet ".$pallet->pallet_qr." was transferred to Q.A.."
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

                    $recepients = $this->_helpers->qa_users();
                    broadcast(new PalletTransferred($content, $pallet_data, $recepients,'/transactions/qa-inspection/'));
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
