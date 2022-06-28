<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Hash;
use Yajra\Datatables\Datatables;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UsersMasterController extends Controller
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
        return view('masters.users', [
            'pages' => $pages,
            'current_url' => route('masters.users')
        ]);
    }

    public function user_list(Request $request)
    {
        $data = [];
        try {
            $query = DB::table('users as u')->select([
                        DB::raw("u.id as id"),
                        DB::raw("u.username as username"),
                        DB::raw("u.firstname as firstname"),
                        DB::raw("u.lastname as lastname"),
                        DB::raw("u.email as email"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("DATE_FORMAT(u.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at")
                    ])
                    ->join('users as uu','u.create_user','=','uu.id')
                    ->where('u.is_deleted',0);

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_user">
                                            <i class="fa fa-edit"></i>
                                        </button>';
                            })
                            ->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }
    
    public function save_user(Request $req)
    {
        $data = [
			'msg' => 'Saving user was unsuccessful.',
            'data' => [],
            'inputs' => $this->get_inputs($req->all()),
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (isset($req->id)) {
                $this->validate($req, [
                    'username' => 'required|string|max:50|min:1',
                    'firstname' => 'required|string|max:50|min:1',
                    'lastname' => 'required|string|max:50|min:1',
                    'email' => 'string'
                ]);

                $user = User::find($req->id);
                $user->username = $req->username;
                $user->firstname = $req->firstname;
                $user->lastname = $req->lastname;
                $user->email = $req->email;
                $user->active = 1;
                $user->create_user = Auth::user()->id;
                $user->update_use = Auth::user()->id;

                if (isset($req->password)) {
                    $user->password = Hash::make($req->password);
                }
    
                if ($user->update()) {
                    $data = [
                        'msg' => 'Updating User Information was successful.',
                        'data' => [],
                        'inputs' => $this->get_inputs($req->all()),
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $this->validate($req, [
                    'username' => 'required|string|max:50|min:1|unique:users,username,is_deleted',
                    'firstname' => 'required|string|max:50|min:1',
                    'lastname' => 'required|string|max:50|min:1',
                    'email' => 'unique:users|string',
                    'password' => 'required|string|min:8|confirmed',
                ]);

                $user = new User();

                $user->username = $req->username;
                $user->firstname = $req->firstname;
                $user->lastname = $req->lastname;
                $user->email = $req->email;
                $user->password = Hash::make($req->password);
                $user->active = 1;
                $user->is_deleted = 0;
                $user->create_user = Auth::user()->id;
                $user->update_user = Auth::user()->id;

                if ($user->save()) {
                    $data = [
                        'msg' => 'Saving User Information was successful.',
                        'data' => [],
                        'inputs' => $this->get_inputs($req->all()),
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
                'inputs' => $this->get_inputs($req->all()),
                'success' => true,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    private function get_inputs($req)
    {
        $inputs = array_keys($req);
        for ($i=0; $i < count($inputs); $i++) { 
            if ($inputs[$i] == "_token") {
                unset($inputs[$i]);
                return $inputs;
            }
        }
        
        return $inputs;
    }

    public function delete_user(Request $req)
    {
        $data = [
			'msg' => 'Deleting user was unsuccessful.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

		if (is_array($req->ids)) {
			foreach ($req->ids as $key => $id) {
				$user = User::find($id);
                $user->is_deleted = 1;
				$user->update();

				$data = [
					'msg' => "User was successfully deleted.",
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
				];
			}
		} else {
			$user = User::find($req->ids);
            $user->is_deleted = 1;
			$user->update();

			$data = [
				'msg' => "User was successfully deleted",
                'data' => [],
				'success' => true,
                'msgType' => 'success',
                'msgTitle' => 'Success!'
			];
		}

        return response()->json($data);
    }
}
