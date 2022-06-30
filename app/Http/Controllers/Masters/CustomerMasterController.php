<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletCustomer;
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
            $query = DB::table('pallet_customers as c')
                        ->join('users as u', 'u.id', '=', 'c.create_user')
                        ->where('c.is_deleted', 0)
                        ->select([
                            DB::raw('c.id as id'),
                            DB::raw('c.customer_name as customer_name'),
                            DB::raw('c.address as address'),
                            DB::raw('c.contact_person1 as contact_person1'),
                            DB::raw('c.contact_number1 as contact_number1'),
                            DB::raw('c.extension1 as extension1'),
                            DB::raw('c.email1 as email1'),
                            DB::raw('c.contact_person2 as contact_person2'),
                            DB::raw('c.contact_number2 as contact_number2'),
                            DB::raw('c.extension2 as extension2'),
                            DB::raw('c.email2 as email2'),
                            DB::raw('c.is_deleted as is_deleted'),
                            DB::raw('u.username as create_user'),
                            DB::raw('c.updated_at as updated_at')
                        ]);

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
                $customer = PalletCustomer::find($req->id);
                $customer->customer_name = $req->customer_name;
                $customer->address = $req->address;
                $customer->contact_person1 = $req->contact_person1;
                $customer->contact_number1 = $req->contact_number1;
                $customer->extension1 = $req->extension1;
                $customer->email1 = $req->email1;
                $customer->contact_person2 = $req->contact_person2;
                $customer->contact_number2 = $req->contact_number2;
                $customer->extension2 = $req->extension2;
                $customer->email2 = $req->email2;
                $customer->update_user = Auth::user()->id;
    
                if ($customer->update()) {
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
                $customer = new PalletCustomer();
                
                $customer->customer_name = $req->customer_name;
                $customer->address = $req->address;
                $customer->contact_person1 = $req->contact_person1;
                $customer->contact_number1 = $req->contact_number1;
                $customer->extension1 = $req->extension1;
                $customer->email1 = $req->email1;
                $customer->contact_person2 = $req->contact_person2;
                $customer->contact_number2 = $req->contact_number2;
                $customer->extension2 = $req->extension2;
                $customer->email2 = $req->email2;
                $customer->create_user = Auth::user()->id;
                $customer->update_user = Auth::user()->id;

                if ($customer->save()) {
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

    public function delete_customer(Request $req)
    {
        $data = [
			'msg' => 'Deleting customer has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (is_array($req->ids)) {
                $update = PalletCustomer::whereIn('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'update_date' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Customer was successfully deleted.",
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $update = PalletCustomer::where('id',$req->ids)
                            ->update([
                                'is_deleted' => 1,
                                'update_user' => Auth::user()->id,
                                'update_date' => date('Y-m-d H:i:s')
                            ]);
                if ($update) {
                    $data = [
                        'msg' => "Customer was successfully deleted.",
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
