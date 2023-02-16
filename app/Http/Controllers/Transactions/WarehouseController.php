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

    public function get_pallets()
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
            DB::raw("IFNULL(p.new_box_count, m.box_count_per_pallet) AS box_count_per_pallet"),
            DB::raw("p.created_at as created_at"),
            DB::raw("p.updated_at as updated_at"),
            DB::raw("r.disposition as reason"),
            DB::raw("(SELECT count(box_qr) from qa_inspected_boxes where pallet_id = p.id) as inspection_sheet_count")
        ])
        ->join('pallet_model_matrices as m','p.model_id','=','m.id')
        ->leftJoin('pallet_disposition_reasons as r','p.disposition_reason','=','r.id')
        ->leftJoin('pallet_qa_dispositions as qad','p.pallet_status','=','qad.id')
        ->where('p.pallet_location','=','WAREHOUSE');

        return Datatables::of($query)->make(true);
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

}
