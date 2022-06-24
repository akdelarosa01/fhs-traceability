<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Yajra\Datatables\Datatables;
use App\Models\User;

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
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $this->validate($req, [
            'username' => 'required|string|max:50|min:1|unique:users,username,NULL,id,is_deleted,NULL',
            'firstname' => 'required|string|max:50|min:1',
            'lastname' => 'required|string|max:50|min:1',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {

            

            $check = User::where('username',$req->username);
            $count = $check->count();

            if ($count) {
            
            }
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => true,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
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
