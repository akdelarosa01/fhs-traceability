<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Yajra\Datatables\Datatables;
use Illuminate\Support\Facades\DB;
use App\Models\PalletBoxNgReason;
use Illuminate\Support\Facades\Auth;

class BoxNGReasonController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'BoxNGReasonMaster');

        return view('masters.box_ng_reasons', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('masters.box-ng-reasons')
        ]);
    }

    public function reason_list()
    {
        $data = [];
        try {
            $query = DB::table('pallet_box_ng_reasons as r')->select([
                        DB::raw("r.id as id"),
                        DB::raw("r.reason as reason"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("r.updated_at as updated_at")
                    ])
                    ->join('users as uu','r.create_user','=','uu.id')
                    ->where('r.is_deleted',0);

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_reason">
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
