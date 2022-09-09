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
        $search_type = "NULL";
        $search_value = "NULL";
        $max_count = 0;
        $shipping_date_from = "NULL";
        $shipping_date_to = "NULL";
        $production_date_from = "NULL";
        $production_date_to = "NULL";

        if (is_null($req->search_type) && is_null($req->shipping_date_from) && is_null($req->production_date_from)) {
            return [];
        } else {
            if (!is_null($req->search_type)) {
                $search_type = "'" . $req->search_type . "'";
            }
    
            if (!is_null($req->shipping_date_from) && !is_null($req->shipping_date_to)) {
                $shipping_date_from = "'" . $req->shipping_date_from . "'";
                $shipping_date_to = "'" . $req->shipping_date_to . "'";
            }
    
            if (!is_null($req->production_date_from) && !is_null($req->production_date_to)) {
                $production_date_from = "'" . $req->production_date_from . "'";
                $production_date_to = "'" . $req->production_date_to . "'";
            }
    
            if (!is_null($req->search_value)) {
                $search_value = "'" . $req->search_value . "'";
            }
    
            if (!is_null($req->max_count)) {
                // $max_count = "LIMIT " . $req->max_count . "";
                $max_count = $req->max_count;
            }
    
            $sql = "call spBoxPalletSearch_GenerateData(".$search_type.",
                                    ".$search_value.",
                                    ".$max_count.",
                                    ".$shipping_date_from.",
                                    ".$shipping_date_to.",
                                    ".$production_date_from.",
                                    ".$production_date_to.")";
    
            $data = DB::select(DB::raw($sql));
    
            return $data;
    
        }
    }
}
