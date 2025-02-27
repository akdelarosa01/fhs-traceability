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
    
    public function index()
    {
        $pages = session('pages');
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'PageMaster');

        return view('masters.pages', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
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
                        DB::raw("case when p.has_sub > 0 then 'YES' else 'NO' end as has_sub"),
                        DB::raw("p.parent_menu as parent_menu"),
                        DB::raw("p.parent_name as parent_name"),
                        DB::raw("p.parent_order as parent_order"),
                        DB::raw("p.order as page_order"),
                        DB::raw("p.icon as icon"),
                        DB::raw("uu.username as create_user"),
                        DB::raw("p.updated_at as updated_at")
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
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving page was unsuccessful.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];
        
        if (isset($req->id)) {
            $this->validate($req, [
                'page_name' => 'required|string|min:1',
                'page_label' => 'required|string|min:1',
                'url' => 'required|string|min:1',
                'parent_menu' => 'required|string|min:1',
                'parent_name' => 'required|string|min:1',
                'parent_order' => 'required|numeric|min:1',
                'order' => 'required|numeric|min:1'
            ]);

            try {
                $page = PalletPage::find($req->id);

                $page->page_name = $req->page_name;
                $page->page_label = $req->page_label;
                $page->url = $req->url;
                $page->has_sub = (isset($req->has_sub))? 1: 0;
                $page->parent_menu = $req->parent_menu;
                $page->parent_name = $req->parent_name;
                $page->parent_order = $req->parent_order;
                $page->order = $req->order;
                $page->icon = $req->icon;
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
                'page_name' => 'required|string|min:1',
                'page_label' => 'required|string|min:1',
                'url' => 'required|string|min:1',
                'parent_menu' => 'required|string|min:1',
                'parent_name' => 'required|string|min:1',
                'parent_order' => 'required|numeric|min:1',
                'order' => 'required|numeric|min:1'
            ]);

            try {
                $page = new PalletPage();

                $page->page_name = $req->page_name;
                $page->page_label = $req->page_label;
                $page->url = $req->url;
                $page->has_sub = (isset($req->has_sub))? 1: 0;
                $page->parent_menu = $req->parent_menu;
                $page->parent_name = $req->parent_name;
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
