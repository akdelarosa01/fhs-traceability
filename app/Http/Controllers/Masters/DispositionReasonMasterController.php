<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Yajra\Datatables\Datatables;
use Illuminate\Support\Facades\DB;
use App\Models\PalletDispositionReason;
use App\Models\PalletQaDisposition;
use Illuminate\Support\Facades\Auth;

class DispositionReasonMasterController extends Controller
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
        return view('masters.disposition_reasons', [
            'pages' => $pages,
            'current_url' => route('masters.disposition-reasons')
        ]);
    }

    public function reason_list()
    {
        $data = [];
        try {
            $query = DB::table('pallet_disposition_reasons as r')->select([
                        DB::raw("r.id as id"),
                        DB::raw("d.id as disposition_id"),
                        DB::raw("d.disposition as disposition"),
                        DB::raw("r.reason as reason"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("r.updated_at as updated_at")
                    ])
                    ->join('users as uu','r.create_user','=','uu.id')
                    ->join('pallet_qa_dispositions as d','r.disposition','=','d.id')
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

    public function get_dispositions(Request $req)
	{
        $results = [];
        $val = (!isset($req->q))? "" : $req->q;
        $display = (!isset($req->display))? "" : $req->display;
        $addOptionVal = (!isset($req->addOptionVal))? "" : $req->addOptionVal;
        $addOptionText = (!isset($req->addOptionText))? "" : $req->addOptionText;
        $sql_query = (!isset($req->sql_query))? "" : $req->sql_query;
        $where = "";

        try {
            if ($addOptionVal != "" && $display == "id&text") {
                array_push($results, [
                    'id' => $addOptionVal,
                    'text' => $addOptionText
                ]);
            }

            if ($sql_query == null || $sql_query == "") {
                $results = PalletQaDisposition::select('id as id','disposition as text')->where('is_deleted',0);

                if ($val !== "") {
                    $results->where('disposition','like',"%" . $val . "%");
                }
            }
            
            $results = $results->get();

        } catch(\Throwable $th) {
            return [
                'success' => false,
                'msessage' => $th->getMessage()
            ];
        }
        
        return $results;
	}

    public function save_reason(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving Reason has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            $this->validate($req, [
                'disposition' => 'required|numeric',
                'reason' => 'required|string|min:1'
            ]);

            try {
                $qa = PalletDispositionReason::find($req->id);
                $qa->disposition = $req->disposition;
                $qa->reason = $req->reason;
                $qa->update_user = Auth::user()->id;
    
                if ($qa->update()) {
                    $data = [
                        'msg' => 'Updating Reason was successful.',
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
                'disposition' => 'required|numeric',
                'reason' => 'required|string|min:1'
            ]);

            try {
                $qa = new PalletDispositionReason();
                
                $qa->disposition = $req->disposition;
                $qa->reason = $req->reason;
                $qa->create_user = Auth::user()->id;
                $qa->update_user = Auth::user()->id;

                if ($qa->save()) {
                    $data = [
                        'msg' => 'Saving Disposition was successful.',
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
			'msg' => 'Deleting Reason has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (is_array($req->ids)) {
                $update = PalletDispositionReason::whereIn('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Reason was successfully deleted.",
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $update = PalletDispositionReason::where('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Reason was successfully deleted.",
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
