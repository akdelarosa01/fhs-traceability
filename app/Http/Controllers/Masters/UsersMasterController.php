<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Illuminate\Support\Facades\Hash;
use Yajra\Datatables\Datatables;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
            //code...
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
                $user->is_deleted = 0;
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
