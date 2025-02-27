<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Yajra\Datatables\Datatables;
use Illuminate\Support\Facades\DB;
use App\Models\PalletHeatSinkNgReason;
use Illuminate\Support\Facades\Auth;

class HeatSinkNGReasonMasterController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'HeatSinkNGReasonMaster');

        return view('masters.hs_ng_reasons', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('masters.heat-sink-ng-reasons')
        ]);
    }

    public function reason_list()
    {
        $data = [];
        try {
            $query = DB::table('pallet_heat_sink_ng_reasons as r')->select([
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

    public function save_reason(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving Heat Sink N.G. Reason has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            $this->validate($req, [
                'reason' => 'required|string|min:1'
            ]);

            try {
                $qa = PalletHeatSinkNgReason::find($req->id);
                $qa->reason = $req->reason;
                $qa->update_user = Auth::user()->id;
    
                if ($qa->update()) {
                    $data = [
                        'msg' => 'Updating Heat Sink N.G. Reason was successful.',
                        'data' => [],
                        'inputs' => $inputs,
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            } catch (\Throwable $th) {
                $data = [
                    'msg' => $th->getMessage(),
                    'data' => [],
                    'inputs' => $inputs,
                    'success' => false,
                    'msgType' => 'error',
                    'msgTitle' => 'Error!'
                ];
            }
            
        } else {
            $this->validate($req, [
                'reason' => 'required|string|min:1'
            ]);

            try {
                $qa = new PalletHeatSinkNgReason();
                
                $qa->reason = $req->reason;
                $qa->create_user = Auth::user()->id;
                $qa->update_user = Auth::user()->id;

                if ($qa->save()) {
                    $data = [
                        'msg' => 'Saving Heat Sink N.G. Reason was successful.',
                        'data' => [],
                        'inputs' => $inputs,
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            } catch (\Throwable $th) {
                $data = [
                    'msg' => $th->getMessage(),
                    'data' => [],
                    'inputs' => $inputs,
                    'success' => false,
                    'msgType' => 'error',
                    'msgTitle' => 'Error!'
                ];
            }

            
        }

        return response()->json($data);
    }

    public function delete_reason(Request $req)
    {
        $data = [
			'msg' => 'Deleting Heat Sink N.G. Reason has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (is_array($req->ids)) {
                $update = PalletHeatSinkNgReason::whereIn('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Heat Sink N.G. Reason was successfully deleted.",
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $update = PalletHeatSinkNgReason::where('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Heat Sink N.G. Reason was successfully deleted.",
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            }
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
}
