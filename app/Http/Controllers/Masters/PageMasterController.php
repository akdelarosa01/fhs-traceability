<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class PageMasterController extends Controller
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
        return view('masters.pages', [
            'pages' => $pages,
            'current_url' => route('masters.page')
        ]);
    }

    public function page_list(Request $request)
    {
        $data = [];
        try {
            $query = DB::table('pallet_pages as p')->select([
                        DB::raw("p.id as id"),
                        DB::raw("p.page_name as page_name"),
                        DB::raw("p.page_label as page_label"),
                        DB::raw("p.url as url"),
                        DB::raw("IF(p.has_sub > 0,'YES','NO') as has_sub"),
                        DB::raw("p.parent_menu as parent_menu"),
                        DB::raw("p.parent_name as parent_name"),
                        DB::raw("p.parent_order as parent_order"),
                        DB::raw("p.`order` as `order`"),
                        DB::raw("p.icon as icon"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("DATE_FORMAT(p.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at")
                    ])
                    ->join('users as uu','p.create_user','=','uu.id')
                    ->where('p.is_deleted',0);

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_page">
                                            <i class="fa fa-edit"></i>
                                        </button>';
                            })
                            ->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }
}
