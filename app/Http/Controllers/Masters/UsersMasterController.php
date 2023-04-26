<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletPage;
use App\Models\PalletPageAccess;
use Illuminate\Support\Facades\Hash;
use Yajra\Datatables\Datatables;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UsersMasterController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'UsersMaster');

        return view('masters.users', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
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
                        DB::raw("u.updated_at as updated_at")
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
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving user was unsuccessful.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        
        if (isset($req->id)) {
            $this->validate($req, [
                'username' => 'required|string|max:50|min:1',
                'firstname' => 'required|string|max:50|min:1',
                'lastname' => 'required|string|max:50|min:1',
                'email' => 'string'
            ]);
            try {
                $user = User::find($req->id);
                $user->username = $req->username;
                $user->firstname = $req->firstname;
                $user->lastname = $req->lastname;
                $user->email = $req->email;
                $user->active = 1;
                $user->create_user = Auth::user()->id;
                $user->update_user = Auth::user()->id;

                if (isset($req->password)) {
                    $user->password = Hash::make($req->password);
                }
    
                if ($user->update()) {
                    $data = [
                        'msg' => 'Updating User Information was successful.',
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
                'username' => [
                    'required',
                    'string',
                    'max:50',
                    'min:1',
                    Rule::unique('users')->where(function ($query) {
                        return $query->where('is_deleted', 0);
                    })
                ],
                'firstname' => 'required|string|max:50|min:1',
                'lastname' => 'required|string|max:50|min:1',
                'email' => 'unique:users|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            try {
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

    public function page_list(Request $req)
    {
        $data = [
			'msg' => '',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $query = [];

        try {
            $has_access = PalletPageAccess::where('user_id',$req->user_id)->count();
            if ($has_access > 0) {
                $pages = PalletPage::select([
                                    'id', 'page_label', 'parent_name','has_sub',
                                    DB::raw("0 as read_only"),
                                    DB::raw("0 as read_and_write"),
                                    DB::raw("0 as `delete`"),
                                    DB::raw("0 as authorize"),
                                    DB::raw("parent_order"),
                                    DB::raw("`order`"),
                                ])
                                ->where('is_deleted',0)
                                ->orderBy('parent_order','asc')
                                ->orderBy('order','asc')
                                ->get();

                $access = DB::select("SELECT pp.page_id,
                                        pp.user_id,
                                        IFNULL(pp.`read_only`,0) as `read_only`,
                                        IFNULL(pp.read_and_write,0) as read_and_write,
                                        IFNULL(pp.`delete`,0) as `delete`,
                                        IFNULL(pp.authorize,0) as authorize
                                    FROM pallet_page_accesses as pp
                                    where pp.user_id = ".$req->user_id."
                                    or pp.read_and_write is null");

                $query = new Collection;
                foreach ($pages as $key => $p) {
                    $read_only = 0;
                    $read_and_write = 0;
                    $delete = 0;
                    $authorize = 0;

                    foreach ($access as $key => $acc) {
                        if ($p->id == $acc->page_id) {
                            $read_only = $acc->read_only;
                            $read_and_write = $acc->read_and_write;
                            $delete = $acc->delete;
                            $authorize = $acc->authorize;
                        }
                    }

                    $query->push([
                        'id' => $p->id,
                        'page_label' => $p->page_label,
                        'parent_name' => $p->parent_name,
                        'has_sub' => $p->has_sub,
                        'read_only' => $read_only,
                        'read_and_write' => $read_and_write,
                        'delete' => $delete,
                        'authorize' => $authorize,
                        'parent_order' => $p->parent_order,
                        'order' => $p->order
                    ]);
                }


                // $query = DB::select("SELECT p.id,
                //                         p.page_label,
                //                         p.parent_name,
                //                         p.has_sub,
                //                         IFNULL(pp.`read_only`,0) as `read_only`,
                //                         IFNULL(pp.read_and_write,0) as read_and_write,
                //                         IFNULL(pp.`delete`,0) as `delete`,
                //                         IFNULL(pp.authorize,0) as authorize
                //                     FROM pallet_pages as p
                //                     left join pallet_page_accesses as pp
                //                     on p.id = pp.page_id
                //                     where p.is_deleted = 0
                //                     and pp.user_id = ".$req->user_id."
                //                     or pp.read_and_write is null");

                $query = $query->all();
            } else {
                $query = PalletPage::select([
                    'id', 'page_label', 'parent_name','has_sub',
                    DB::raw("0 as read_only"),
                    DB::raw("0 as read_and_write"),
                    DB::raw("0 as `delete`"),
                    DB::raw("0 as authorize"),
                    DB::raw("parent_order"),
                    DB::raw("`order`"),
                ])
                ->where('is_deleted',0)
                ->orderBy('parent_order','asc')
                ->orderBy('order','asc')
                ->get();
            }

           

            $data = [
                'data' => $query,
                'success' => true,
            ];

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => true,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return $data;
    }

    public function save_user_access(Request $req)
    {
        $data = [
			'msg' => 'Saving User access has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $page_id = 0;
        $read_and_write = 0;
        $delete = 0;
        $authorize = 0;

        try {
            PalletPageAccess::where('user_id',$req->user_id)->delete();
            foreach ($req->access as $key => $access) {
                $page_id = $access['page_id'];
                $read_only = $access['read_only'];
                $read_and_write = $access['read_and_write'];
                $delete = $access['delete'];
                $authorize = $access['authorize'];

                PalletPageAccess::create([
                    'user_id' => $req->user_id,
                    'page_id' => $page_id,
                    'status' => 1,
                    'read_only' => $read_only,
                    'read_and_write' => $read_and_write,
                    'delete' => $delete,
                    'authorize' => $authorize,
                    'create_user' => Auth::user()->id,
                    'update_user' => Auth::user()->id
                ]);
            }

            $data = [
                'msg' => 'Saving User access was successful.',
                'data' => [],
                'success' => true,
                'msgType' => 'success',
                'msgTitle' => 'Success!'
            ];

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => true,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return $data;
    }
}
