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
}
