<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class GreaseDataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'GreaseDataQuery');

        return view('reports.grease_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.grease-data-query')
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
        $grease_date = "";
        $exp_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->grease_date_from) && is_null($req->grease_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'container_no':
                            $search_type = " AND ContainerNo REGEXP '".$req->search_value."' ";
                            break;
                        case 'grease_batch_no':
                            $search_type = " AND GreaseBatchNo REGEXP '".$req->search_value."' ";
                            break;
                        case 'grease_model':
                            $search_type = " AND GreaseModel REGEXP '".$req->search_value."' ";
                            break;
                        case 'machine_no':
                            $search_type = " AND MachineNo REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND Model REGEXP '".$req->search_value."' ";
                            break;
                        case 'hs_serial':
                            $search_type = " AND SerialNo REGEXP '".$req->search_value."' ";
                            break;
                        default:
                            $search_type = " AND GreaseModel REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->grease_date_from) && !is_null($req->grease_date_to)) {
                    $grease_date= " AND DATE_FORMAT(GreaseDate,'%Y-%m-%d') BETWEEN '" . $req->grease_date_from . "' AND '" . $req->grease_date_to . "' ";
                }

                if (!is_null($req->exp_date_from) && !is_null($req->exp_date_to)) {
                    $exp_date= " AND DATE_FORMAT(GreaseExpDate,'%Y-%m-%d') BETWEEN '" . $req->exp_date_from . "' AND '" . $req->exp_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                $sql = "SELECT GreaseDate as grease_date,
                                Model as model_code,
                                SerialNo as hs_serial,
                                ContainerNo as container_no,
                                GreaseBatchNo as grease_batch_no,
                                GreaseModel as grease_model,
                                GreaseExpDate as grease_exp_date,
                                YieldCount as yield_count,
                                BinCount as bin_count,
                                Remarks as remarks,
                                WorkUser as work_user,
                                MachineNo as machine_no
                            FROM furukawa.tgreasehs
                            where 1=1 " .$search_type.$grease_date.$exp_date.$max_count;
        
                $data = collect(DB::select(DB::raw($sql)));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
