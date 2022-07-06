<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class BoxPalletModelMatrixController extends Controller
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
        return view('masters.box_pallet_model_matrix', [
            'pages' => $pages,
            'current_url' => route('masters.model-matrix')
        ]);
    }

    // public function model_matrix_list()
    // {
    //     $data = [];
    //     try {
    //         $query = DB::table('pallet_model_matrices as m')->select([
    //                     DB::raw("m.id as id"),
    //                     DB::raw("m.model as model"),
    //                     DB::raw("m.model_name as model_name"),
    //                     DB::raw("m.box_count_per_pallet as box_count_per_pallet"),
    //                     DB::raw("uu.username as create_user"),
    //                     DB::raw("m.updated_at as updated_at")
    //                 ])
    //                 ->join('users as uu','m.create_user','=','uu.id')
    //                 ->where('m.is_deleted',0);

    //         return Datatables::of($query)
    //                         ->addColumn('action', function($data) {
    //                             return '<button class="btn btn-sm btn-primary btn_edit_model">
    //                                         <i class="fa fa-edit"></i>
    //                                     </button>';
    //                         })
    //                         ->make(true);
    //     } catch (\Throwable $th) {
    //         //throw $th;
    //     }

    //     return $data;
    // }
}
