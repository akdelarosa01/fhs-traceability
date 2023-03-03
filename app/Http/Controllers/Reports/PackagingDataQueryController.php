<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class PackagingDataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'PackagingDataQuery');

        return view('reports.packaging_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.packaging-data-query')
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
        $packaging_date = "";
        $exp_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->packaging_date_from) && is_null($req->packaging_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'box_no':
                            $search_type = " AND LPAD(c7,3,'0') REGEXP '".$req->search_value."' ";
                            break;
                        case 'work_order':
                            $search_type = " AND c8 REGEXP '".$req->search_value."' ";
                            break;
                        case 'machine_no':
                            $search_type = " AND c2 REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND c3 REGEXP '".$req->search_value."' ";
                            break;
                        case 'hs_serial':
                            $search_type = " AND c4 REGEXP '".$req->search_value."' ";
                            break;
                        case 'operator':
                            $search_type = " AND c12 REGEXP '".$req->search_value."' ";
                            break;
                        default: // lot no
                            $search_type = " AND c9 REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->packaging_date_from) && !is_null($req->packaging_date_to)) {
                    $packaging_date= " AND DATE_FORMAT(c1,'%Y-%m-%d') BETWEEN '" . $req->packaging_date_from . "' AND '" . $req->packaging_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                $sql = "SELECT DATE_FORMAT(c1,'%Y-%m-%d %H:%i:%s') as packaging_date,
                            c2 as machine_no,
                            c3 as model_code,
                            c4 as hs_serial,
                            c6 as work_user,
                            LPAD(c7,3,'0') as box_no,
                            c8 as work_order,
                            c9 as lot_no,
                            c10 as old_hs_serial,
                            c11 as change_date,
                            c12 as operator,
                            c13 as remarks
                        FROM formal.barcode
                        where 1=1 " .$search_type.$packaging_date.$exp_date.$max_count;
        
                $data = collect(DB::select(DB::raw($sql)));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
