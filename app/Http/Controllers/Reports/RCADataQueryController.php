<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class RCADataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'RCADataQuery');

        return view('reports.rca_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.rca-data-query')
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
        $ins_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->ins_date_from) && is_null($req->ins_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'judgment':
                            $search_type = " AND t.c12 REGEXP '".$req->search_value."' ";
                            break;
                        case 'machine_no':
                            $search_type = " AND t.c14 REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND t.c15 REGEXP '".$req->search_value."' ";
                            break;
                        case 'hs_serial':
                            $search_type = " AND t.c28 REGEXP '".$req->search_value."' ";
                            break;
                        default:
                            $search_type = " AND t.c11 REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->ins_date_from) && !is_null($req->ins_date_to)) {
                    $ins_date= " AND DATE_FORMAT(STR_TO_DATE(t.c1,'%Y/%m/%d %H:%i:%s'),'%Y-%m-%d') BETWEEN '" . $req->ins_date_from . "' AND '" . $req->ins_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                $sql = "SELECT distinct STR_TO_DATE(t.c1,'%Y/%m/%d %H:%i:%s') as ins_date,
                                t.c15 as model_code,
                                t.c28 as hs_serial,
                                t.c14 as machine_no,
                                t.c11 as slot,
                                t.c12 as judgment,
                                e.c7 as error_msg,
                                t.c13 as user_id,
                                t.c2 as tc1,
                                t.c3 as tc2,
                                t.c4 as ta,
                                t.c5 as t_diff1,
                                t.c6 as t_diff2,
                                t.c7 as rth_1_2,
                                t.c8 as rth_2_2,
                                t.c9 as p1,
                                t.c10 as p2,
                                t.c16 as test_time_sec,
                                t.c17 as tc1_temp,
                                t.c18 as tc2_temp,
                                t.c19 as tc1_fan_start_temp,
                                t.c20 as tc2_fan_start_temp,
                                t.c21 as r1_set,
                                t.c22 as r2_set,
                                t.c23 as upper_limit_temp,
                                t.c24 as lower_limit_temp,
                                t.c25 as fan_voltage,
                                t.c26 as upper_fan_vol_tolerance,
                                t.c27 as lower_fan_vol_tolerance,
                                t.c29 as inspection_mode
                            from formal.thermal as t
                            left join formal.thermal_error as e
                            on e.c2 = t.c28 and t.c12 like 'NG%'
                            where 1=1 " .$search_type.$ins_date.$max_count;
        
                $data = collect(DB::select(DB::raw($sql)));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
