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
    
    public function index()
    {
        $pages = session('pages');
        return view('home', [
            'pages' => $pages,
            'read_only' => 0,
            'authorize' => 1,
            'current_url' => route('home')
        ]);
    }
}
