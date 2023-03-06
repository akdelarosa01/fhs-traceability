<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class ShipmentDataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'ShipmentDataQuery');

        return view('reports.shipment_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.shipment-data-query')
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
        $shipment_date = "";
        $exp_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->shipment_date_from) && is_null($req->shipment_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'destination':
                            $search_type = " AND LPAD(c7,3,'0') REGEXP '".$req->search_value."' ";
                            break;
                        case 'pallet_no':
                            $search_type = " AND d.pallet_qr REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND s.model REGEXP '".$req->search_value."' ";
                            break;
                        case 'truck_plate_no':
                            $search_type = " AND s.truck_plate_no REGEXP '".$req->search_value."' ";
                            break;
                        case 'shipping_seal_no':
                            $search_type = " AND s.shipping_seal_no REGEXP '".$req->search_value."' ";
                            break;
                        case 'peza_seal_no':
                            $search_type = " AND s.peza_seal_no REGEXP '".$req->search_value."' ";
                            break;
                        default: // lot no
                            $search_type = " AND s.control_no REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->shipment_date_from) && !is_null($req->shipment_date_to)) {
                    $shipment_date= " AND DATE_FORMAT(s.ship_date,'%Y-%m-%d') BETWEEN '" . $req->shipment_date_from . "' AND '" . $req->shipment_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                $sql = "SELECT s.ship_date,
                            s.control_no,
                            s.model,
                            s.ship_qty as total_ship_qty,
                            s.pallet_qty,
                            s.destination,
                            s.truck_plate_no,
                            s.shipping_seal_no,
                            s.peza_seal_no,
                            s.shipper,
                            s.qc_pic,
                            s.`status` as shipment_status,
                            d.pallet_qr,
                            d.box_qty,
                            d.hs_qty
                        FROM furukawa.shipments as s
                        join furukawa.shipment_details as d
                        on d.ship_id = s.id
                        where d.is_deleted <> 1 " .$search_type.$shipment_date.$exp_date.$max_count;
        
                $data = collect(DB::select(DB::raw($sql)));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }
}
