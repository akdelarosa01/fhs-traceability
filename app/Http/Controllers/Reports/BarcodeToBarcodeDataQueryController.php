<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class BarcodeToBarcodeDataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'BarcodeToBarcodeDataQuery');

        return view('reports.barcode_to_barcode_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.barcode-to-barcode-data-query')
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
        $transfer_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->transfer_date_from) && is_null($req->transfer_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'new_barcode':
                            $search_type = " AND NewBarcode REGEXP '".$req->search_value."' ";
                            break;
                        case 'old_barcode':
                            $search_type = " AND OldBarcode REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND ModelName REGEXP '".$req->search_value."' ";
                            break;
                        case 'machine_no':
                            $search_type = " AND MachineNo REGEXP '".$req->search_value."' ";
                            break;
                        default: // reason
                            $search_type = " AND Reason REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->transfer_date_from) && !is_null($req->transfer_date_to)) {
                    $transfer_date= " AND DATE_FORMAT(DateTransfer,'%Y-%m-%d') BETWEEN '" . $req->transfer_date_from . "' AND '" . $req->transfer_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                $sql = "SELECT DateTransfer as transfer_date,
                        ModelName as model_code,
                        OldBarcode as old_barcode,
                        NewBarcode as new_barcode,
                        Reason as reason,
                        TransferStatus as transfer_status,
                        MachineNo as machine_no,
                        NumOfRepairs as num_of_repairs
                        FROM furukawa.barcode_to_barcode
                        where 1=1 " .$search_type.$transfer_date.$max_count;
        
                $data = collect(DB::select(DB::raw($sql)));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
