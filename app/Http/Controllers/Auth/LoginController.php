<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\PalletPageAccess;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    public function username()
    {
        return 'username';
    }

    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request $request
     *
     * @return Exception
     */
    public function validateLogin(Request $req)
    {
        $user_count = User::where('username', $req->username)->count();

        if($user_count > 0) {
            $user = User::where('username', $req->username)->first();

            if ($user_count > 1) {
                $user = User::where('username', $req->username)->orderBy('id','desc')->first();
            }

            if ($user->password !== bcrypt($req->password)) {
                throw ValidationException::withMessages(['password' => __("Password is incorrect.")]);
            } elseif ($user->is_deleted == 1) {
                throw ValidationException::withMessages([$this->username() => __("User account was deactivated, Please contact your administrator.")]);
            } else {

                return redirect()->intended('home');
            }
        } else {
            throw ValidationException::withMessages([$this->username() => __("Username doesn't exists. Please contact your administrator.")]);
        }

        return $req->validate([
            $this->username() => 'required|string',
            'password' => 'required|string',
        ]);
    }

    /**
     * The user has been authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
    protected function authenticated(Request $req, $user)
    {
        $page = new PalletPageAccess();
        $user_access = $page->menu_list($user->id)->toJson();
        $req->session()->put('user_accesses', $user_access);
    }
}
