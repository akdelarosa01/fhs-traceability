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
use App\Models\WarehouseToShipment;

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

    public function get_pallets(Request $req)
    {
        try {
            $search_type = NULL;
        $search_value =  NULL;
        $update_date_to =  NULL;
        $update_date_from =  NULL;
        $max_count = NULL;

        $search_type = $req->search_type;
        $search_value = $req->search_value;
        $update_date_to = $req->update_date_to;
        $update_date_from = $req->update_date_from;
        $max_count = $req->max_count;
        $sql = "call spWarehouse_getPallets()";
        $sql_data = collect(DB::select(DB::raw($sql)));

        if ($search_type == NULL && $search_value == NULL){
            return Datatables::of($sql_data)->make(true);
        }
        else{
            $sql_data = $sql_data->where($search_type,$search_value);
            if($update_date_to != NULL && $update_date_from != NULL ){
                $update_date_to = date($update_date_to);
                $update_date_from = date($update_date_from);
                $sql_data = $sql_data->whereBetween('updated_at',[$update_date_from,$update_date_to]);
            }
            if($max_count != NULL){
                $sql_data = $sql_data->skip(0)->take($max_count);
            }
            return Datatables::of($sql_data)->make(true);
        }
        } catch (\Throwable $th) {
            
        }
        
    }

    public function get_boxes(Request $req)
    {
        $data = [
            'data' => [],
            'success' => true
        ];

        $query = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                    ->select(
                        DB::raw("pb.id as id"),
                        DB::raw("pb.pallet_id as pallet_id"),
                        DB::raw("pb.model_id as model_id"),
                        DB::raw("pb.box_qr as box_qr"),
                        DB::raw("IFNULL(pb.box_judgment, -1) AS box_judgement"),
                        DB::raw("qa.date_manufactured as date_manufactured"),
                        DB::raw("qa.date_expired as date_expired"),
                        DB::raw("qa.lot_no as lot_no"),
                        DB::raw("qa.prod_line_no as prod_line_no"),
                        DB::raw("qa.qty_per_box as qty_per_box"),
                        DB::raw("qa.inspector as inspector"),
                        DB::raw("qa.shift as shift")
                    )
                    ->join('pallet_model_matrices as m','m.id', '=', 'pb.model_id')
                    ->leftJoin('qa_inspected_boxes as qa','qa.box_id', '=', 'pb.id')
                    ->where('pb.pallet_id', $req->pallet_id)
                    ->where('pb.is_deleted', 0)
                    ->orderBy('pb.box_qr', 'desc')
                    ->distinct()
                    ->get();

            $data = [
                'data' => $query,
                'success' => true
            ];
                    
        return response()->json($data);

    }

    public function send_to_shipment(Request $req){
        
        try {
            $data = DB::table('pallet_box_pallet_hdrs')->whereIn('id',$req->Data)->select()->get()->toArray();
            $user = Auth::user()->id;
            foreach ($data as $data){
                $pallet_data = $data;
                $msg = "Pallet ".$data->pallet_qr." was successfully transferred.";
                $content = [
                    'title' => "Pallet Transferred to Shipment",
                    'message' => "Pallet ".$data->pallet_qr." was transferred to Shipment."
                ];

                $qa = new WarehouseToShipment();
                $qa->model_id = $data->model_id;
                $qa->pallet_id = $data->id;
                $qa->pallet_qr = $data->pallet_qr;
                $qa->pallet_location = $data->pallet_location;
                $qa->is_shipped = 0;
                $qa->shipped_at = NULL;
                $qa->create_user = $user;
                $qa->created_at= date('Y-m-d H:i:s');
                $qa->update_user = $user;
                $qa->updated_at = date('Y-m-d H:i:s');
                $done = $qa->save();

                $recepients = $this->_helpers->whs_users();
                broadcast(new PalletTransferred($content, $pallet_data, $recepients,'/transactions/shipment/'));
                }
                    $data = [
                        'msg' => 'Transferring Pallet to Shipment was successful.',
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
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

    public function send_to_qa(Request $req){
        try {
            

            $user = Auth::user()->id;
            foreach ($req->Data as $data){
                 $pallet = DB::table('pallet_box_pallet_hdrs')->where('id',$data)->select()->get()->toArray()[0];
                 $pallet_data = $pallet;
                 $msg = "Pallet ".$pallet->pallet_qr." was successfully transferred.";

                    $content = [
                        'title' => "Pallet Transferred Back to Q.A",
                        'message' => "Pallet ".$pallet->pallet_qr." was transferred for Q.A. Inspection."
                    ];
                $qa = DB::table('pallet_box_pallet_hdrs')->where('id',$data)->update([
                    'pallet_location' => 'Q.A.',
                ]);
                $recepients = $this->_helpers->whs_users();
                broadcast(new PalletTransferred($content, $pallet_data, $recepients,'/transactions/qa-inspection/'));
            };

            $data = [
                'msg' => 'Transferring Pallet to Q.A was successful.',
                'data' => [],
                'success' => true,
                'msgType' => 'success',
                'msgTitle' => 'Success!'
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

    
}
