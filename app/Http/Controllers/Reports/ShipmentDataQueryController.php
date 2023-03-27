<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Exports\ShipmentDataQueryExport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

use Maatwebsite\Excel\Excel;
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
        $create_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->shipment_date_from) && is_null($req->shipment_date_to) && is_null($req->create_date_from) && is_null($req->create_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'destination':
                            $search_type = " AND s.destination REGEXP '".$req->search_value."' ";
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

                if (!is_null($req->create_date_from) && !is_null($req->create_date_to)) {
                    $create_date = " AND DATE_FORMAT(s.created_at,'%Y-%m-%d') BETWEEN '" . $req->create_date_from . "' AND '" . $req->create_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                $sql = "SELECT s.ship_date, ";
                $sql .= "    s.control_no, ";
                $sql .= "    s.model, ";
                $sql .= "    s.ship_qty as total_ship_qty, ";
                $sql .= "    s.pallet_qty, ";
                $sql .= "    s.destination, ";
                $sql .= "    s.truck_plate_no, ";
                $sql .= "    s.shipping_seal_no, ";
                $sql .= "    s.peza_seal_no, ";
                $sql .= "    s.shipper, ";
                $sql .= "    s.qc_pic, ";
                $sql .= "    s.`status` as shipment_status, ";
                $sql .= "    d.pallet_qr, ";
                $sql .= "    d.box_qty, ";
                $sql .= "    d.hs_qty, ";
                $sql .= "    d.pallet_id ";
                $sql .= "FROM furukawa.shipments as s ";
                $sql .= "join furukawa.shipment_details as d ";
                $sql .= "on d.ship_id = s.id ";
                $sql .= "where d.is_deleted = 0 " .$search_type.$shipment_date.$create_date.$max_count;
        
                $data = DB::select(DB::raw($sql));
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }
    }

    public function get_boxes(Request $req)
    {
        $data = [
            'msg' => "Retrieving Pallet's boxes has failed.",
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];
        try {
            $boxes = DB::table('pallet_box_pallet_dtls as b')
                        ->join('qa_inspected_boxes as i','i.box_id','=','b.id')
                        ->where('b.pallet_id',$req->pallet_id)
                        ->where('b.is_deleted',0)
                        ->select(
                            DB::raw("b.id as box_id"),
                            'b.pallet_id',
                            'b.box_qr',
                            'i.date_manufactured',
                            'i.date_expired',
                            'i.customer_pn',
                            'i.lot_no',
                            'i.prod_line_no',
                            'i.qty_per_box'
                        )
                        ->get();
            
            $data = [
                'data' => $boxes,
                'success' => true,
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

    public function get_heat_sinks(Request $req)
    {
        $data = [
            'msg' => "Retrieving Boxes's Heat Sinks has failed.",
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];
        try {
            $hs = DB::table('qa_inspection_sheet_serials')->where('box_id',$req->box_id)->get();
            
            $data = [
                'data' => $hs,
                'success' => true,
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

    public function download_excel(Request $req, Excel $excel)
    {
        $search_type = "";
        $max_count = "";
        $shipment_date = "";
        $create_date = "";

        if (is_null($req->search_type) && is_null($req->shipment_date_from) && is_null($req->shipment_date_to) && is_null($req->create_date_from) && is_null($req->create_date_to)) {
            return [];
        } else {
            if (!is_null($req->search_type) && !is_null($req->search_value)) {
                switch ($req->search_type) {
                    case 'destination':
                        $search_type = " AND s.destination REGEXP '".$req->search_value."' ";
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

            if (!is_null($req->create_date_from) && !is_null($req->create_date_to)) {
                $create_date = " AND DATE_FORMAT(s.created_at,'%Y-%m-%d') BETWEEN '" . $req->create_date_from . "' AND '" . $req->create_date_to . "' ";
            }
    
            if (!is_null($req->max_count)) {
                $max_count = " LIMIT " . $req->max_count . "";
            }
    
            $sql = "SELECT s.created_at, s.ship_date, ";
            $sql .= "    s.control_no, ";
            $sql .= "    s.invoice_no, ";
            $sql .= "    s.model, ";
            $sql .= "    s.ship_qty as total_ship_qty, ";
            $sql .= "    s.pallet_qty, ";
            $sql .= "    s.destination, ";
            $sql .= "    s.truck_plate_no, ";
            $sql .= "    s.shipping_seal_no, ";
            $sql .= "    s.peza_seal_no, ";
            $sql .= "    s.shipper, ";
            $sql .= "    s.qc_pic, ";
            $sql .= "    d.pallet_qr, ";
            $sql .= "    d.box_qty, ";
            $sql .= "    d.hs_qty, ";
            $sql .= "    d.pallet_id, ";
            $sql .= "    b.box_qr, ";
            $sql .= "    b.lot_no, ";
            $sql .= "    b.box_id, ";
            $sql .= "    count(h.hs_serial) as hs_count ";
            $sql .= "FROM furukawa.shipments as s ";
            $sql .= "join furukawa.shipment_details as d ";
            $sql .= "on d.ship_id = s.id ";
            $sql .= "join furukawa.qa_inspected_boxes as b ";
            $sql .= "on b.pallet_id = d.pallet_id ";
            $sql .= "join furukawa.qa_inspection_sheet_serials as h ";
            $sql .= "on h.box_id = b.box_id ";
            $sql .= "where d.is_deleted = 0 " .$search_type.$shipment_date.$create_date;
            $sql .= "GROUP BY s.created_at, s.ship_date, ";
            $sql .= "    s.control_no, ";
            $sql .= "    s.invoice_no, ";
            $sql .= "    s.model, ";
            $sql .= "    s.ship_qty, ";
            $sql .= "    s.pallet_qty, ";
            $sql .= "    s.destination, ";
            $sql .= "    s.truck_plate_no, ";
            $sql .= "    s.shipping_seal_no, ";
            $sql .= "    s.peza_seal_no, ";
            $sql .= "    s.shipper, ";
            $sql .= "    s.qc_pic, ";
            $sql .= "    d.pallet_qr, ";
            $sql .= "    d.box_qty, ";
            $sql .= "    d.hs_qty, ";
            $sql .= "    d.pallet_id, ";
            $sql .= "    b.box_qr, ";
            $sql .= "    b.lot_no, ";
            $sql .= "    b.box_id ";
    
            $boxes = DB::select(DB::raw($sql));

            $sql = "SELECT b.box_qr, b.box_id, h.prod_date, ";
            $sql .= "     h.hs_serial ";
            $sql .= "FROM furukawa.shipments as s ";
            $sql .= "join furukawa.shipment_details as d ";
            $sql .= "on d.ship_id = s.id ";
            $sql .= "join furukawa.qa_inspected_boxes as b ";
            $sql .= "on b.pallet_id = d.pallet_id ";
            $sql .= "join furukawa.qa_inspection_sheet_serials as h ";
            $sql .= "on h.box_id = b.box_id ";
            $sql .= "where d.is_deleted = 0 " .$search_type.$shipment_date.$create_date;

            $heat_sinks = DB::select(DB::raw($sql));

            // return view('exports.shipment-data-query', [
            //     'boxes' => $boxes,
            //     'heat_sinks' => $heat_sinks
            // ]);

            $date = date('Ymd');
            $fileName ='Shipment_Tracking_'.$date.'.xlsx';
            return $excel->download(new ShipmentDataQueryExport($boxes, $heat_sinks), $fileName);
        }
    }
}
