<?php

namespace App\Http\Controllers\Masters;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use Yajra\Datatables\Datatables;
use Illuminate\Support\Facades\DB;
use App\Models\PalletDispositionReason;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class DispositionReasonMasterController extends Controller
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
        return view('masters.disposition_reasons', [
            'pages' => $pages,
            'current_url' => route('masters.disposition-reasons')
        ]);
    }

    public function get_dispositions(Request $req)
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

                if ($val !== "") {
                    $where = " AND disposition LIKE '%" . $val . "%'";
                }

                $sql_query = "SELECT DISTINCT id as id,  disposition as `text`
                                FROM pallet_qa_dispositions 
                                WHERE is_deleted = 0 " . $where;
            }
            
            $results = DB::select($sql_query);

        } catch(\Throwable $th) {
            return [
                'success' => false,
                'msessage' => $th->getMessage()
            ];
        }
        
        return $results;
	}

    public function save_reason(Request $req)
    {
        $inputs = $this->_helpers->get_inputs($req->all());
        $data = [
			'msg' => 'Saving Reason has failed.',
            'data' => [],
            'inputs' => $inputs,
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            $this->validate($req, [
                'disposition' => 'required|numeric',
                'reason' => 'required|string|min:1'
            ]);

            try {
                $qa = PalletDispositionReason::find($req->id);
                $qa->disposition = $req->disposition;
                $qa->reason = $req->reason;
                $qa->update_user = Auth::user()->id;
    
                if ($qa->update()) {
                    $data = [
                        'msg' => 'Updating Reason was successful.',
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
                'disposition' => 'required|numeric',
                'reason' => 'required|string|min:1'
            ]);

            try {
                $qa = new PalletDispositionReason();
                
                $qa->disposition = $req->disposition;
                $qa->reason = $req->reason;
                $qa->create_user = Auth::user()->id;
                $qa->update_user = Auth::user()->id;

                if ($qa->save()) {
                    $data = [
                        'msg' => 'Saving Disposition was successful.',
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
}
