<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class BoxPalletDataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'BoxPalletDataQuery');

        return view('reports.box_pallet_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.box-pallet-data-query')
        ]);
    }

    public function generate_data(Request $req)
    {
        $data = $this->get_filtered_data($req);
        return DataTables::of($data)->toJson();
    }

    private function get_filtered_data($req)
    {
        $search_type = "";
        $max_count = "";
        $bp_date = "";
        $exp_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->bp_date_from) && is_null($req->bp_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'pallet_no':
                            $search_type = " AND p.pallet_qr REGEXP '".$req->search_value."' ";
                            break;
                        case 'box_no':
                            $search_type = " AND b.box_qr REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND m.model REGEXP '".$req->search_value."' ";
                            break;
                        case 'hs_serial':
                            $search_type = " AND bd.HS_Serial REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->bp_date_from) && !is_null($req->bp_date_to)) {
                    $bp_date= " AND DATE_FORMAT(p.created_at,'%Y-%m-%d') BETWEEN '" . $req->bp_date_from . "' AND '" . $req->bp_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }

                switch ($req->search_type) {
                    case 'pallet_no':
                        $sql = "SELECT distinct p.id as id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    p.pallet_status as pallet_status,
                                    p.pallet_location as pallet_location,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                where t.is_deleted <> 1 ".$search_type.$bp_date.$max_count;
                        break;
                    case 'box_no':
                        $sql = "SELECT distinct p.id as id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    p.pallet_status as pallet_status,
                                    p.pallet_location as pallet_location,
                                    b.box_qr as box_qr,
                                    b.box_judgment as box_judgement,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                join furukawa.pallet_box_pallet_dtls as b
                                on b.pallet_id = p.id
                                where b.is_deleted <> 1".$search_type.$bp_date.$max_count;
                        break;
                    case 'model_code':
                        $sql = "SELECT distinct p.id as id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    p.pallet_status as pallet_status,
                                    p.pallet_location as pallet_location,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                where t.is_deleted <> 1 ".$search_type.$bp_date.$max_count;
                        break;
                    case 'hs_serial':
                        $sql = "SELECT distinct p.id as id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    p.pallet_status as pallet_status,
                                    p.pallet_location as pallet_location,
                                    b.box_qr as box_qr,
                                    b.box_judgment as box_judgement,
                                    bd.HS_Serial,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                join furukawa.pallet_box_pallet_dtls as b
                                on b.pallet_id = p.id
                                join furukawa.tboxqr as bb
                                on bb.qrBarcode = b.box_qr
                                join tboxqrdetails as bd
                                on bd.Box_ID = bb.ID
                                where b.is_deleted <> 1 ".$search_type.$bp_date.$max_count;
                        break;
                    default:
                        $sql = "SELECT distinct p.id as id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    p.pallet_status as pallet_status,
                                    p.pallet_location as pallet_location,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                where t.is_deleted <> 1 ".$bp_date.$max_count;
                        break;
                }
        
                $data = collect(DB::select(DB::raw($sql)));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
