<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Common\Helpers;

class HomeController extends Controller
{
    protected $_helpers;

    public function __construct()
    {
        $this->middleware('auth');
        $this->_helpers = new Helpers;
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $pages = session('pages');
        return view('home', [
            'pages' => $pages,
            'current_url' => route('home')
        ]);
    }
}
