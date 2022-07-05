<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\QaDisposition;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class QADispositionMasterController extends Controller
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
        return view('masters.qa_disposition', [
            'pages' => $pages,
            'current_url' => route('masters.qa-disposition')
        ]);
    }

    public function disposition_list(Request $request)
    {
        $data = [];
        try {
            $query = DB::table('qa_dispositions as d')->select([
                        DB::raw("d.id as id"),
                        DB::raw("d.disposition as disposition"),
                        DB::raw("d.color_hex as color_hex"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("d.updated_at as updated_at")
                    ])
                    ->join('users as uu','d.create_user','=','uu.id')
                    ->where('d.is_deleted',0);

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_disposition">
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
