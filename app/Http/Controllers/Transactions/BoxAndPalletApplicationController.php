<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletModelMatrix;
use App\Models\PalletTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Yajra\Datatables\Datatables;

class BoxAndPalletApplicationController extends Controller
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
        return view('transactions.box_and_pallet_application', [
            'pages' => $pages,
            'current_url' => route('transactions.box-and-pallet')
        ]);
    }

    public function get_models(Request $req)
    {
        $results = [];
        $val = (!isset($req->q))? "" : $req->q;
        $display = (!isset($req->display))? "" : $req->display;
        $addOptionVal = (!isset($req->addOptionVal))? "" : $req->addOptionVal;
        $addOptionText = (!isset($req->addOptionText))? "" : $req->addOptionText;
        $sql_query = (!isset($req->sql_query))? "" : $req->sql_query;
        $where = "";

        try {
            if ($addOptionVal != "" && $display == "id&text") {
                array_push($results, [
                    'id' => $addOptionVal,
                    'text' => $addOptionText
                ]);
            }

            if ($sql_query == null || $sql_query == "") {
                $results = PalletModelMatrix::select(
                                'id as id',
                                DB::raw("CONCAT(model,' | ', model_name) as text"),
                                'box_count_per_pallet'
                            )->where('is_deleted',0);

                if ($val !== "") {
                    $results->where(DB::raw("CONCAT(model,' | ', model_name)"),'like',"%" . $val . "%");
                }
            }
            
            $results = $results->get();

        } catch(\Throwable $th) {
            return [
                'success' => false,
                'msessage' => $th->getMessage()
            ];
        }
        
        return $results;
    }

    public function proceed(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Creating transaction has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        $this->validate($req, [
            'model_id' => 'required',
            'target_no_of_pallet' => 'required|numeric',
        ]);

        try {
            $trans = new PalletTransaction();
            
            $trans->model_id = $req->model_id;
            $trans->target_no_of_pallet = $req->target_no_of_pallet;
            $trans->model_status = 0;
            $trans->create_user = Auth::user()->id;
            $trans->update_user = Auth::user()->id;

            if ($trans->save()) {
                $data = [
                    'msg' => 'Transaction has successfully proceeded.',
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

        return response()->json($data);
    }
}
