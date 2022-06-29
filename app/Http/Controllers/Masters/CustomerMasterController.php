<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class CustomerMasterController extends Controller
{
    protected $_helpers;

    public function __construct()
    {
        $this->middleware('auth');
        $this->_helpers = new Helpers;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pages = session('pages');
        return view('masters.customer', [
            'pages' => $pages,
            'current_url' => route('masters.customers')
        ]);
    }

    public function customer_list(Request $request)
    {
        $data = [];
        try {
            $query = DB::select(DB::raw("CALL spBoxPallet_GetCustomerList()"));

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_customer">
                                            <i class="fa fa-edit"></i>
                                        </button>';
                            })
                            ->toJson();
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }
}
