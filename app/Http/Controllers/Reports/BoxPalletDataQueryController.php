<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Exports\BoxPalletDataQueryExport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;
use Maatwebsite\Excel\Excel;

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
        return response()->json([
            'success' => true,
            'data' => $data,
            'search_type' => $req->search_type
        ]);
    }

    private function get_filtered_data($req)
    {
        $search_type = "";

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

                switch ($req->search_type) {
                    case 'pallet_no':
                        $sql = "SELECT distinct p.id as pallet_id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    CASE WHEN p.new_box_count IS NOT NULL THEN 1 ELSE 0 END as is_broken_pallet,
                                    m.box_count_per_pallet as box_count_per_pallet,
                                    IFNULL(p.new_box_count,'') as broken_pallet_qty,
                                    CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status,
                                    CASE WHEN s.pallet_id is not null and p.is_shipped = 1 then 'SHIPPED'
                                    WHEN s.pallet_id is not null and p.is_shipped = 0 then 'FOR SHIPMENT'
                                    else p.pallet_location end as pallet_location,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                left join furukawa.shipment_details as s
                                on s.pallet_id = p.id and s.is_deleted <> 1
                                left join furukawa.pallet_qa_dispositions as qad
                                on p.pallet_status = qad.id
                                where t.is_deleted <> 1 ".$search_type;
                        break;
                    case 'box_no':
                        $sql = "SELECT distinct b.id as box_id,
                                    b.pallet_id as pallet_id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    CASE WHEN p.new_box_count IS NOT NULL THEN 1 ELSE 0 END as is_broken_pallet,
                                    m.box_count_per_pallet as box_count_per_pallet,
                                    IFNULL(p.new_box_count,'') as broken_pallet_qty,
                                    CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status,
                                    CASE WHEN s.pallet_id is not null and p.is_shipped = 1 then 'SHIPPED'
                                    WHEN s.pallet_id is not null and p.is_shipped = 0 then 'FOR SHIPMENT'
                                    else p.pallet_location end as pallet_location,
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
                                left join furukawa.shipment_details as s
                                on s.pallet_id = p.id and s.is_deleted <> 1
                                left join furukawa.pallet_qa_dispositions as qad
                                on p.pallet_status = qad.id
                                where b.is_deleted <> 1".$search_type;
                        break;
                    case 'model_code':
                        $sql = "SELECT distinct p.id as pallet_id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    CASE WHEN p.new_box_count IS NOT NULL THEN 1 ELSE 0 END as is_broken_pallet,
                                    m.box_count_per_pallet as box_count_per_pallet,
                                    IFNULL(p.new_box_count,'') as broken_pallet_qty,
                                    CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status,
                                    CASE WHEN s.pallet_id is not null and p.is_shipped = 1 then 'SHIPPED'
                                    WHEN s.pallet_id is not null and p.is_shipped = 0 then 'FOR SHIPMENT'
                                    else p.pallet_location end as pallet_location,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                left join furukawa.shipment_details as s
                                on s.pallet_id = p.id and s.is_deleted <> 1
                                left join furukawa.pallet_qa_dispositions as qad
                                on p.pallet_status = qad.id
                                where t.is_deleted <> 1 ".$search_type;
                        break;
                    case 'hs_serial':
                        $sql = "SELECT distinct p.id as pallet_id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    CASE WHEN p.new_box_count IS NOT NULL THEN 1 ELSE 0 END as is_broken_pallet,
                                    m.box_count_per_pallet as box_count_per_pallet,
                                    IFNULL(p.new_box_count,'') as broken_pallet_qty,
                                    CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status,
                                    CASE WHEN s.pallet_id is not null and p.is_shipped = 1 then 'SHIPPED'
                                    WHEN s.pallet_id is not null and p.is_shipped = 0 then 'FOR SHIPMENT'
                                    else p.pallet_location end as pallet_location,
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
                                left join furukawa.shipment_details as s
                                on s.pallet_id = p.id and s.is_deleted <> 1
                                left join furukawa.pallet_qa_dispositions as qad
                                on p.pallet_status = qad.id
                                where b.is_deleted <> 1 ".$search_type;
                        break;
                    default:
                        $sql = "SELECT distinct p.id as pallet_id,
                                    m.model as model,
                                    m.model_name as model_name,
                                    p.pallet_qr as pallet_qr,
                                    CASE WHEN p.new_box_count IS NOT NULL THEN 1 ELSE 0 END as is_broken_pallet,
                                    m.box_count_per_pallet as box_count_per_pallet,
                                    IFNULL(p.new_box_count,'') as broken_pallet_qty,
                                    CASE WHEN p.pallet_status IN (1,2,3,4,5) THEN qad.disposition ELSE 'ON PROGRESS' END as pallet_status,
                                    CASE WHEN s.pallet_id is not null and p.is_shipped = 1 then 'SHIPPED'
                                    WHEN s.pallet_id is not null and p.is_shipped = 0 then 'FOR SHIPMENT'
                                    else p.pallet_location end as pallet_location,
                                    p.created_at as created_at
                                FROM furukawa.pallet_box_pallet_hdrs as p
                                join furukawa.pallet_transactions as t
                                on t.id = p.transaction_id
                                join furukawa.pallet_model_matrices as m
                                on m.id = p.model_id
                                left join furukawa.shipment_details as s
                                on s.pallet_id = p.id and s.is_deleted <> 1
                                left join furukawa.pallet_qa_dispositions as qad
                                on p.pallet_status = qad.id
                                where t.is_deleted <> 1 ";
                        break;
                }
        
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
            $sql = "SELECT DISTINCT pb.id as box_id, ";
            $sql .= "   pb.pallet_id as pallet_id, ";
            $sql .= "   pb.model_id as model_id, ";
            $sql .= "   pb.box_qr as box_qr, ";
            $sql .= "   pb.remarks as prod_remarks, ";
            $sql .= "   IFNULL(pb.box_judgment, -1) AS box_judgement, ";
            $sql .= "   i.production_date, ";
            $sql .= "   i.lot_no, ";
            $sql .= "   i.cust_part_no, ";
            $sql .= "   i.fec_part_no, ";
            $sql .= "   i.qty, ";
            $sql .= "   i.weight ";
            $sql .= "FROM pallet_box_pallet_dtls as pb ";
            $sql .= "left join tinspectionsheetprintdata as i ";
            $sql .= "on i.BoxSerialNo = pb.box_qr ";
            $sql .= "where pb.is_deleted <> 1 ";
            $sql .= "AND pb.pallet_id = ".$req->pallet_id;

            $boxes = DB::connection('mysql')->select(DB::raw($sql));
            
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
            $sql = "SELECT distinct hs.c1 as date_scanned, ";
            $sql .= "       hs.c4 as hs_serial, ";
            $sql .= "       hs.c2 as production_line, ";
            $sql .= "       hs.c6 as operator, ";
            $sql .= "       hs.c8 as work_order, ";
            $sql .= "       g.GreaseBatchNo as grease_batch, ";
            $sql .= "       g.ContainerNo as grease_no, ";
            $sql .= "       ins.c7 as rca_value, ";
            $sql .= "       ins.c12 as rca_judgment, ";
            $sql .= "       IFNULL(bb.OldBarcode,'') as old_barcode, ";
            $sql .= "       IFNULL(bb.ProcessType,'') as process_type, ";
            $sql .= "       IFNULL(bb.DateTransfer,'') as B2B_date  ";
            $sql .= "FROM furukawa.pallet_box_pallet_dtls as pb ";
            $sql .= "join furukawa.tinspectionsheetprintdata as insp ";
            $sql .= "on pb.box_qr = insp.BoxSerialNo ";
            $sql .= "join formal.barcode as hs on hs.c9 = insp.lot_no and hs.c7 = insp.test_result ";
            $sql .= "left join furukawa.tgreasehs as g on g.SerialNo = hs.c4 ";
            $sql .= "left join formal.thermal as ins on ins.c28 = hs.c4 ";
            $sql .= "left join furukawa.barcode_to_barcode as bb on bb.NewBarcode = hs.c4 "; 
            $sql .= "where pb.is_deleted <> 1 ";
            $sql .= "AND pb.pallet_id = ".$req->pallet_id."  ";
            $sql .= "and pb.id = ".$req->box_id;

            $hs = DB::select(DB::raw($sql));
            
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
        $data = $this->get_filtered_data($req);
        $date = date('Ymd');
        $fileName ='FTL_Traceability_'.$date.'.xlsx';
        return $excel->download(new BoxPalletDataQueryExport($data, $req->search_type), $fileName);
    }
}
