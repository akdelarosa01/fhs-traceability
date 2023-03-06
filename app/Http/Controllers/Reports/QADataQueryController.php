<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Exports\QADataExport;
use App\Models\QaAffectedSerial;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;
use Maatwebsite\Excel\Excel;

class QADataQueryController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'QADataQuery');

        return view('reports.qa_data_query', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('reports.qa-data-query')
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
        $search_value = "";
        $max_count = "";
        $oba_date = "";
        $exp_date = "";

        try {
            DB::beginTransaction();
            if (is_null($req->search_type) && is_null($req->oba_date_from) && is_null($req->exp_date_from) && is_null($req->exp_date_from) && is_null($req->exp_date_to)) {
                return [];
            } else {
                if (!is_null($req->search_type) && !is_null($req->search_value)) {
                    switch ($req->search_type) {
                        case 'shift':
                            $search_type = " AND b.shift REGEXP '".$req->search_value."' ";
                            break;
                        case 'box_label':
                            $search_type = " AND b.box_qr REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_code':
                            $search_type = " AND m.model REGEXP '".$req->search_value."' ";
                            break;
                        case 'model_name':
                            $search_type = " AND m.model_name REGEXP '".$req->search_value."' ";
                            break;
                        case 'pallet_label':
                            $search_type = " AND p.pallet_qr REGEXP '".$req->search_value."' ";
                            break;
                        case 'cutomer_pn':
                            $search_type = " AND b.customer_pn REGEXP '".$req->search_value."' ";
                            break;
                        case 'lot_no':
                            $search_type = " AND b.lot_no REGEXP '".$req->search_value."' ";
                            break;
                        
                        default:
                            $search_type = " AND b.prod_line_no REGEXP '".$req->search_value."' ";
                            break;
                    }
                }
        
                if (!is_null($req->oba_date_from) && !is_null($req->oba_date_to)) {
                    $oba_date= " AND DATE_FORMAT(b.updated_at,'%Y-%m-%d') BETWEEN '" . $req->oba_date_from . "' AND '" . $req->oba_date_to . "' ";
                }
        
                if (!is_null($req->exp_date_from) && !is_null($req->exp_date_to)) {
                    $exp_date = " AND DATE_FORMAT(b.date_expired,'%Y-%m-%d') BETWEEN '" . $req->exp_date_from . "' AND '" . $req->exp_date_to . "' ";
                }
        
                if (!is_null($req->max_count)) {
                    $max_count = " LIMIT " . $req->max_count . "";
                }
        
                //$sql = "call spQADataQuery_GenerateData(".$search_type.", ".$search_value.", ".$max_count.", ".$oba_date_from.", ".$oba_date_to.", ".$exp_date_from.", ".$exp_date_to.")";

                $sql = "SELECT DATE_FORMAT(b.updated_at, '%Y-%m-%d') as oba_date,
                                b.pallet_id as pallet_id,
                                b.box_id as box_id,
                                b.shift as shift,
                                b.box_qr as box_label,
                                m.model as model_code,
                                m.model_name as model_name,
                                b.date_manufactured as date_manufactured,
                                b.date_expired as date_expired,
                                p.pallet_qr as pallet_no,
                                b.customer_pn as cutomer_pn,
                                b.lot_no as lot_no,
                                b.prod_line_no as prod_line_no,
                                CASE WHEN right(b.box_qr,1) = 'R' then SUBSTRING(b.box_qr,-4,3) else right(b.box_qr,3) end as box_no,
                                b.inspection_sheet_qr as serial_nos,
                                b.qty_per_box as qty_per_box,
                                b.inspector as qc_incharge,
                                bx.box_judgment as disposition,
                                group_concat(concat(hs.OldBarcode,' -> ',hs.NewBarcode)) as hs_history,
                                qa.qa_judgment as qa_judgment
                            FROM qa_inspected_boxes as b
                            JOIN pallet_box_pallet_dtls as bx
                            ON bx.id = b.box_id
                            JOIN pallet_box_pallet_hdrs as p
                            ON p.id = b.pallet_id
                            LEFT JOIN pallet_model_matrices as m
                            ON p.model_id = m.id
                            left join furukawa.barcode_to_barcode as hs
                            ON hs.ModelName = m.model and b.inspection_sheet_qr like concat('%',hs.OldBarcode,'%')
                            LEFT JOIN (SELECT box_id, 
                                            group_concat(concat(hs_serial,'=', CASE WHEN qa_judgment = 1 then 'GOOD'
                                                WHEN qa_judgment = 0 then remarks
                                                ELSE ''
                                            END) SEPARATOR ',\n\r') AS qa_judgment
                                        FROM furukawa.qa_affected_serials
                                        group by box_id) AS qa
                            ON qa.box_id = b.box_id
                            where bx.is_deleted <> 1 " .$search_type.$oba_date.$exp_date."
                            group by DATE_FORMAT(b.updated_at, '%Y-%m-%d'),
                                b.pallet_id,
                                b.box_id,
                                b.shift,
                                b.box_qr,
                                m.model,
                                m.model_name,
                                b.date_manufactured,
                                b.date_expired,
                                p.pallet_qr,
                                b.customer_pn,
                                b.lot_no,
                                b.prod_line_no,
                                box_no,
                                b.inspection_sheet_qr,
                                b.qty_per_box,
                                b.inspector,
                                bx.box_judgment,
                                qa.qa_judgment ". $max_count;
        
                $sql_data = collect(DB::select(DB::raw($sql)));

                // return $sql_data;
    
                $data = [];
                $data_obj = [];
                //DB::table('qa_data_query')->where('token',$req->_token)->delete();

                foreach ($sql_data as $key => $box) {
                    $box_obj = [
                        'token' => $req->_token,
                        'oba_date' => $box->oba_date,
                        'shift' => $box->shift,
                        'box_label' => $box->box_label,
                        'model_code' => $box->model_code,
                        'model_name' => $box->model_name,
                        'date_manufactured' => $box->date_manufactured,
                        'date_expired' => $box->date_expired,
                        'pallet_no' => $box->pallet_no,
                        'cutomer_pn' => $box->cutomer_pn,
                        'lot_no' => $box->lot_no,
                        'prod_line_no' => $box->prod_line_no,
                        'box_no' => $box->box_no,
                        'serial_nos' => $box->serial_nos,
                        'qty_per_box' => $box->qty_per_box,
                        'qc_incharge' => $box->qc_incharge,
                        'hs_history' => $box->hs_history,
                        'disposition' => $box->disposition,
                        'qa_judgment' => $box->qa_judgment
                    ];
    
                    $heat_sinks = collect(QaAffectedSerial::where([
                        ['pallet_id','=',$box->pallet_id],
                        ['box_id','=',$box->box_id]
                        // ['updated_at','LIKE', $box->oba_date.'%']
                    ])->select('hs_serial')->get());
    

                    $hs_obj = [];
                    for ($i=1; $i <= 60; $i++) { 
                        $key = $i-1;
                        $hs = (!isset($heat_sinks[$key]))? "":$heat_sinks[$key]->hs_serial;
    
                        $hs_obj['product_'.$i] = $hs;
                    }
    
                    $param = array_merge($box_obj,$hs_obj);
                    // DB::table('qa_data_query')->insert($param);

                    // $data_obj = (object) $param;
                    array_push($data, $param);
                }
                
                DB::commit();

                $data = collect($data);
        
                return $data;
        
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            throw $th;
        }

        
    }

    public function download_excel(Request $req, Excel $excel)
    {
        $data = DB::table('qa_data_query')->where('token',$req->_token)->get();
        $date = date('Ymd');
        $fileName ='QA_data_'.$date.'.xlsx';
        return $excel->download(new QADataExport($data), $fileName);
    }
}
