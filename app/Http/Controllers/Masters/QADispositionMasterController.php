<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletQaDisposition;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
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
    
    public function index()
    {
        $pages = session('pages');
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'QADispositionsMaster');

        return view('masters.qa_disposition', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('masters.qa-disposition')
        ]);
    }

    public function disposition_list()
    {
        $data = [];
        try {
            $query = DB::table('pallet_qa_dispositions as d')->select([
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

    public function save_disposition(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving Disposition has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            $this->validate($req, [
                'disposition' => 'required|string|min:1',
                'color_hex' => 'required|string|min:1'
            ]);

            try {
                $qa = PalletQaDisposition::find($req->id);
                $qa->disposition = $req->disposition;
                $qa->color_hex = $req->color_hex;
                $qa->update_user = Auth::user()->id;
    
                if ($qa->update()) {
                    $data = [
                        'msg' => 'Updating Disposition was successful.',
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
                'disposition' => [
                    'required',
                    'string',
                    'min:1',
                    Rule::unique('pallet_qa_dispositions')->where(function ($query) {
                        return $query->where('is_deleted', 0);
                    })
                ],
                'color_hex' => 'required|string|min:1'
            ]);

            try {
                $qa = new PalletQaDisposition();
                
                $qa->disposition = $req->disposition;
                $qa->color_hex = $req->color_hex;
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

    public function delete_disposition(Request $req)
    {
        $data = [
			'msg' => 'Deleting Disposition has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (is_array($req->ids)) {
                $update = PalletQaDisposition::whereIn('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Disposition was successfully deleted.",
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $update = PalletQaDisposition::where('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Disposition was successfully deleted.",
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
