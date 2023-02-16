<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class BoxAndPalletDataSearchController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'BoxAndPalletDataSearch');

        return view('reports.box_pallet_data_search', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.box-pallet-data-search')
        ]);
    }

    public function generate_data(Request $req)
    {
        $data = $this->get_filtered_data($req);
        return DataTables::of($data)->toJson();
    }

    private function get_filtered_data($req)
    {
        $search_type1 = "";
        $search_type2 = "";
        $max_count = "";
        $shipping_date = "";
        $production_date_from = "NULL";
        $production_date_to = "NULL";

        if (is_null($req->search_type) && is_null($req->shipping_date_from) && is_null($req->production_date_from)) {
            return [];
        } else {
            if (!is_null($req->search_type)) {
                $check = ['rca_value','rca_judgment'];

                if (!in_array($req->search_type, $check)) {
                    $search_type1 = " AND ft.c12 regexp 'OK'";
                }

                switch($req->search_type) {
                    case 'model':
                        $search_type2 = " AND ft.c15 REGEXP '".$req->search_value."'";
                        break;
                    case 'pallet_qr':
                        $search_type2 = " AND p.pallet_qr REGEXP '".$req->search_value."'";
                        break;
                    case 'box_id':
                        $search_type2 = " AND b.box_qr REGEXP '".$req->search_value."'";
                        break;
                    case 'cust_part_no':
                        $search_type2 = " AND insp.cust_part_no REGEXP '".$req->search_value."'";
                        break;
                    case 'hs_serial':
                        $search_type2 = " AND ft.c28 REGEXP '".$req->search_value."'";
                        break;
                    case 'grease_batch':
                        $search_type2 = " AND g.GreaseBatchNo REGEXP '".$req->search_value."'";
                        break;
                    case 'grease_no':
                        $search_type2 = " AND g.ContainerNo REGEXP '".$req->search_value."'";
                        break;
                    case 'rca_value':
                        $search_type2 = " AND ft.c7 REGEXP '".$req->search_value."'";
                        break;
                    case 'rca_judgment':
                        $search_type2 = " AND ft.c12 REGEXP '".$req->search_value."'";
                        break;
                    default:
                        $search_type2 = " AND fb.c9 REGEXP '".$req->search_value."'";
                        break;
                }
                
            }
    
            if (!is_null($req->shipping_date_from) && !is_null($req->shipping_date_to)) {
                $shipping_date= " AND DATE_FORMAT(p.shipped_at,'%Y-%m-%d') BETWEEN '" . $req->shipping_date_from . "' AND '".$req->shipping_date_to."'";
            }
    
            if (!is_null($req->production_date_from) && !is_null($req->production_date_to)) {
                $production_date_from = "'" . $req->production_date_from . "'";
                $production_date_to = "'" . $req->production_date_to . "'";
            }
    
            if (!is_null($req->max_count)) {
                $max_count = " LIMIT " . $req->max_count . "";
            }

            $sql = "select distinct ifnull(p.shipped_at,'') as shipping_date,
                        case
                            when qa.created_at is not null then 'QA Inspection'
                            when p.pallet_qr is not null then 'Boxed in Pallet'
                            when fb.c1 is not null then 'Output Scanning (P3)'
                            when g.CreateDate is not null then 'Grease Application'
                            else 'Thermal RCA Testing (P2)'
                        end as destination,
                        case
                            when qa.created_at is not null then qa.created_at
                            when b.created_at is not null then b.created_at
                            when fb.c1 is not null then ifnull(STR_TO_DATE(fb.c1,'%Y/%m/%d %H:%i:%s'), fb.c1)
                            when g.CreateDate is not null then g.CreateDate
                            else STR_TO_DATE(ft.c1,'%Y/%m/%d %H:%i:%s')
                        end as production_date,
                        fb.c3 as model,
                        fb.c9 as lot_no,
                        fb.c4 as hs_serial,
                        insp.cust_part_no as cust_part_no,
                        ft.c7 as rca_value,
                        ft.c12 as rca_judgment,
                        g.GreaseBatchNo as grease_batch,
                        g.ContainerNo as grease_no,
                        p.pallet_qr as pallet_qr,
                        b.box_qr as box_id,
                        CASE WHEN qhs.qa_judgment = 1 THEN 'GOOD'
                            WHEN qhs.qa_judgment = 0 THEN qhs.remarks
                            ELSE ''
                        END as qa_judgment
                    from formal.thermal as ft
                    left join formal.barcode as fb on fb.c4 = ft.c28
                    inner join furukawa.tinspectionsheetprintdata as insp 
                    on fb.c9 = insp.lot_no and 1 = CASE 
                                                        WHEN FIND_IN_SET(fb.c4,REPLACE(REPLACE(REPLACE(REPLACE(insp.qrbarcodes,';',','),char(13),''),char(10),''),' ','')) > 0 THEN 1 
                                                        ELSE 0 
                                                    END
                    left join furukawa.tgreasehs as g on g.SerialNo = ft.c28
                    left join furukawa.pallet_box_pallet_dtls as b on insp.BoxSerialNo = b.box_qr
                    left join furukawa.pallet_box_pallet_hdrs as p on b.pallet_id = p.id
                    left join furukawa.qa_inspected_boxes as qa on qa.pallet_id = p.id and qa.box_id = b.id
                    left join furukawa.qa_affected_serials as qhs on qhs.pallet_id = p.id and qhs.box_id = b.id and qhs.hs_serial = ft.c28
                    where case
                        when ".$production_date_from." is not null then
                            case
                                when qa.created_at is not null then DATE_FORMAT(qa.created_at,'%Y-%m-%d')
                                when b.created_at is not null then DATE_FORMAT(b.created_at,'%Y-%m-%d')
                                when fb.c1 is not null then DATE_FORMAT(ifnull(STR_TO_DATE(fb.c1,'%Y/%m/%d %H:%i:%s'), fb.c1),'%Y-%m-%d')
                                when g.CreateDate is not null then DATE_FORMAT(g.CreateDate,'%Y-%m-%d')
                                else DATE_FORMAT(STR_TO_DATE(ft.c1,'%Y/%m/%d %H:%i:%s'),'%Y-%m-%d')
                            end BETWEEN ".$production_date_from." AND ".$production_date_to."
                        else 1=1
                    end ".$shipping_date.$search_type1.$search_type2.$max_count;
    
            // $sql = "call spBoxPalletSearch_GenerateData(".$search_type.",
            //                         ".$search_value.",
            //                         ".$max_count.",
            //                         ".$shipping_date_from.",
            //                         ".$shipping_date_to.",
            //                         ".$production_date_from.",
            //                         ".$production_date_to.")";
    
            $data = DB::select(DB::raw($sql));
    
            return $data;
    
        }
    }
}
