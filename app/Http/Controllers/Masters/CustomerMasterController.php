<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Auth;
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

    public function save_customer(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving customer has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            $this->validate($req, [
                'customer_name' => 'required|string|min:1',
                'address' => 'required|string|min:1'
            ]);

            try {
                $update = DB::table('mcustomermaster')
                            ->where('id', $req->id)
                            ->update([
                                'customer_name' => $req->customer_name,
                                'address' => $req->address,
                                'contact_person1' => $req->contact_person1,
                                'contact_number1' => $req->contact_number1,
                                'extension1' => $req->extension1,
                                'email1' => $req->email1,
                                'contact_person2' => $req->contact_person2,
                                'contact_number2' => $req->contact_number2,
                                'extension2' => $req->extension2,
                                'email2' => $req->email2,
                                'update_user' => Auth::user()->id,
                                'update_date' => date('Y-m-d H:i:s')
                            ]);
    
                if ($update) {
                    $data = [
                        'msg' => 'Updating Customer Information was successful.',
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
                'customer_name' => 'required|string|min:1',
                'address' => 'required|string|min:1'
            ]);

            try {
                $insert = DB::table('mcustomermaster')
                            ->insert([
                                'customer_name' => $req->customer_name,
                                'address' => $req->address,
                                'contact_person1' => $req->contact_person1,
                                'contact_number1' => $req->contact_number1,
                                'extension1' => $req->extension1,
                                'email1' => $req->email1,
                                'contact_person2' => $req->contact_person2,
                                'contact_number2' => $req->contact_number2,
                                'extension2' => $req->extension2,
                                'email2' => $req->email2,
                                'create_user' => Auth::user()->id,
                                'update_user' => Auth::user()->id,
                                'create_date' => date('Y-m-d H:i:s'),
                                'update_date' => date('Y-m-d H:i:s')
                            ]);

                if ($insert) {
                    $data = [
                        'msg' => 'Saving Customer Information was successful.',
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
}
