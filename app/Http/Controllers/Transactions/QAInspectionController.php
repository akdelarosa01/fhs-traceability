<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Models\PalletBoxPalletDtl;
use App\Models\PalletBoxPalletHdr;
use App\Models\PalletModelMatrix;
use App\Models\PalletPageAccess;
use App\Models\PalletPrintPalletLabel;
use App\Models\PalletTransaction;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Yajra\Datatables\Datatables;

class QAInspectionController extends Controller
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
        return view('transactions.qa_inspection', [
            'pages' => $pages,
            'current_url' => route('transactions.qa-inspection')
        ]);
    }
    public function pallet_list()
    {
        $data = [];

            $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
                DB::raw("p.id as id"),
                DB::raw("p.model_id as model_id"),
                DB::raw("p.transaction_id as transaction_id"),
                DB::raw("p.pallet_status as pallet_status"),
                DB::raw("p.pallet_qr as pallet_qr"),
                DB::raw("p.new_box_count as new_box_count"),
                DB::raw("p.pallet_location as pallet_location"),
                DB::raw("p.is_printed as is_printed"),
                DB::raw("p.created_at as created_at"),
                DB::raw("p.updated_at as updated_at")
            ])
            ->where([
                ['p.pallet_status','=','1'],
                ['p.pallet_location','=','Q.A.']
            ]);

            return Datatables::of($query)->make(true);
        

        return $data;
    }
    public function get_boxes(Request $req)
    {
        $data = [];
        try {
            $query = $this->boxes($req->pallet_id);
            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }
        return $data;
    }

    private function boxes($pallet_id)
    {
        $query = DB::connection('mysql')->table('pallet_box_pallet_dtls as pb')
                    ->select(
                        'pb.id',
                        'pb.pallet_id',
                        'pb.model_id',
                        'pb.box_qr',
                        'pb.remarks',
                        'pb.created_at',
                        'pb.updated_at'
                    )
                    // ->join('tboxqr as bqr','bqr.qrBarcode','=','pb.box_qr')
                    // ->join('tboxqrdetails as bqrd','bqr.ID','=','bqrd.Box_ID')
                    ->where('pb.pallet_id',$pallet_id)
                    ->orderBy('pb.id','desc');
        return $query;
    }

    // public function get_serials(Request $req)
    // {
    //     $data = [];
    //     try {
    //         $query = $this->serials($req->box_qr);
    //         return Datatables::of($query)->make(true);
    //     } catch (\Throwable $th) {
    //         //throw $th;
    //     }
    //     return $data;
    // }

    // private function serials($box_qr)
    // {
    //     $query = DB::connection('mysql')->table('tboxqrdetails as bqrd')
    //                 ->select(
    //                     'bqrd.HS_Serial'
    //                 )
    //                 ->join('tboxqr as bqr','bqr.ID','=','bqrd.Box_ID')
    //                 ->where('tboxqr.qrBarcode',$box_qr);
    //     return $query;
    // }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
