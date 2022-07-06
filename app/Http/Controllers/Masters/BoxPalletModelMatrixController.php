<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletModelMatrix;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
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

    public function model_matrix_list()
    {
        $data = [];
        try {
            $query = DB::table('pallet_model_matrices as m')->select([
                        DB::raw("m.id as id"),
                        DB::raw("m.model as model"),
                        DB::raw("m.model_name as model_name"),
                        DB::raw("m.box_count_per_pallet as box_count_per_pallet"),
                        DB::raw("m.box_count_to_inspect as box_count_to_inspect"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("m.updated_at as updated_at")
                    ])
                    ->join('users as uu','m.create_user','=','uu.id')
                    ->where('m.is_deleted',0);

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_model">
                                            <i class="fa fa-edit"></i>
                                        </button>';
                            })
                            ->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }

    public function save_model(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving Model has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            $this->validate($req, [
                'model' => 'required|string|min:1',
                'model_name' => 'required|string|min:1',
                'box_count_per_pallet' => 'required|numeric',
                'box_count_to_inspect' => 'required|numeric'
            ]);

            try {
                $mm = PalletModelMatrix::find($req->id);
                $mm->model = $req->model;
                $mm->model_name = $req->model_name;
                $mm->box_count_per_pallet = $req->box_count_per_pallet;
                $mm->box_count_to_inspect = $req->box_count_to_inspect;
                $mm->update_user = Auth::user()->id;
    
                if ($mm->update()) {
                    $data = [
                        'msg' => 'Updating Model was successful.',
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
                'model' => [
                    'required',
                    'string',
                    'min:1',
                    Rule::unique('pallet_model_matrices')->where(function ($query) {
                        return $query->where('is_deleted', 0);
                    })
                ],
                'model_name' => 'required|string|min:1',
                'box_count_per_pallet' => 'required|numeric',
                'box_count_to_inspect' => 'required|numeric'
            ]);

            try {
                $mm = new  PalletModelMatrix();
                
                $mm->model = $req->model;
                $mm->model_name = $req->model_name;
                $mm->box_count_per_pallet = $req->box_count_per_pallet;
                $mm->box_count_to_inspect = $req->box_count_to_inspect;
                $mm->create_user = Auth::user()->id;
                $mm->update_user = Auth::user()->id;

                if ($mm->save()) {
                    $data = [
                        'msg' => 'Saving Model was successful.',
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

    public function delete_model(Request $req)
    {
        $data = [
			'msg' => 'Deleting Model has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (is_array($req->ids)) {
                $update = PalletModelMatrix::whereIn('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Model was successfully deleted.",
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $update = PalletModelMatrix::where('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'updated_at' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Model was successfully deleted.",
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
