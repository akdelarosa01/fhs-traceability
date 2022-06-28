<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletPage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class PageMasterController extends Controller
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
        return view('masters.pages', [
            'pages' => $pages,
            'current_url' => route('masters.page')
        ]);
    }

    public function page_list(Request $request)
    {
        $data = [];
        try {
            $query = DB::table('pallet_pages as p')->select([
                        DB::raw("p.id as id"),
                        DB::raw("p.page_name as page_name"),
                        DB::raw("p.page_label as page_label"),
                        DB::raw("p.url as url"),
                        DB::raw("IF(p.has_sub > 0,'YES','NO') as has_sub"),
                        DB::raw("p.parent_menu as parent_menu"),
                        DB::raw("p.parent_name as parent_name"),
                        DB::raw("p.parent_order as parent_order"),
                        DB::raw("p.`order` as `order`"),
                        DB::raw("p.icon as icon"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("DATE_FORMAT(p.updated_at,'%Y-%m-%d %H:%i:%s') as updated_at")
                    ])
                    ->join('users as uu','p.create_user','=','uu.id')
                    ->where('p.is_deleted',0);

            return Datatables::of($query)
                            ->addColumn('action', function($data) {
                                return '<button class="btn btn-sm btn-primary btn_edit_page">
                                            <i class="fa fa-edit"></i>
                                        </button>';
                            })
                            ->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }

    public function save_page(Request $req)
    {
        $inputs = $this->get_inputs($req->all());
        $data = [
			'msg' => 'Saving user was unsuccessful.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            if (isset($req->id)) {
                $this->validate($req, [
                    'page_name' => 'required|string|min:1',
                    'page_label' => 'required|string|min:1',
                    'url' => 'required|string|min:1',
                    'parent_menu' => 'required|string|min:1',
                    'parent_order' => 'required|numeric|min:1',
                    'order' => 'required|numeric|min:1'
                ]);

                $page = PalletPage::find($req->id);

                $page->page_name = $req->page_name;
                $page->page_label = $req->page_label;
                $page->url = $req->url;
                $page->has_sub = (isset($req->has_sub))? 1: 0;
                $page->parent_menu = $req->parent_menu;
                $page->parent_order = $req->parent_order;
                $page->order = $req->order;
                $page->icon = $req->icon;
                $page->is_deleted = 0;
                $page->create_user = Auth::user()->id;
                $page->update_user = Auth::user()->id;
    
                if ($page->update()) {
                    $data = [
                        'msg' => 'Updating Page Information was successful.',
                        'data' => [],
                        'inputs' => $inputs,
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
                
            } else {
                $this->validate($req, [
                    'page_name' => 'required|string|min:1',
                    'page_label' => 'required|string|min:1',
                    'url' => 'required|string|min:1',
                    'parent_menu' => 'required|string|min:1',
                    'parent_order' => 'required|numeric|min:1',
                    'order' => 'required|numeric|min:1'
                ]);

                $page = new PalletPage();

                $page->page_name = $req->page_name;
                $page->page_label = $req->page_label;
                $page->url = $req->url;
                $page->has_sub = (isset($req->has_sub))? 1: 0;
                $page->parent_menu = $req->parent_menu;
                $page->parent_order = $req->parent_order;
                $page->order = $req->order;
                $page->icon = $req->icon;
                $page->is_deleted = 0;
                $page->create_user = Auth::user()->id;
                $page->update_user = Auth::user()->id;

                if ($page->save()) {
                    $data = [
                        'msg' => 'Saving Page Information was successful.',
                        'data' => [],
                        'inputs' => $inputs,
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
                'inputs' => $inputs,
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

    public function delete_page(Request $req)
    {
        $data = [
			'msg' => 'Deleting page was unsuccessful.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

		if (is_array($req->ids)) {
			foreach ($req->ids as $key => $id) {
				$page = PalletPage::find($id);
                $page->is_deleted = 1;
				$page->update();

				$data = [
					'msg' => "Page was successfully deleted.",
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
				];
			}
		} else {
			$page = PalletPage::find($req->ids);
            $page->is_deleted = 1;
			$page->update();

			$data = [
				'msg' => "Page was successfully deleted",
                'data' => [],
				'success' => true,
                'msgType' => 'success',
                'msgTitle' => 'Success!'
			];
		}

        return response()->json($data);
    }
}
