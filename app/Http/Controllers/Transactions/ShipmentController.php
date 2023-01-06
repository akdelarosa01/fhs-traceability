<?php

namespace App\Http\Controllers\Transactions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Common\Helpers;
use App\Events\PalletTransferred;
use App\Models\PalletCustomer;
use App\Models\PalletBoxPalletHdr;
use App\Models\Shipment;
use App\Models\ShipmentDetail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Yajra\Datatables\Datatables;

class ShipmentController extends Controller
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
        $permission = $this->_helpers->get_permission(Auth::user()->id, 'Shipment');

        return view('transactions.shipment', [
            'pages' => $pages,
            'read_only' => $permission->read_only,
            'authorize' => $permission->authorize,
            'current_url' => route('transactions.shipment')
        ]);
    }

    public function get_customer_destinations(Request $req)
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
                $results = DB::connection('mysql')->table('pallet_customers')
                            ->select(
                                DB::raw("customer_name as id"),
                                DB::raw("CONCAT(customer_name, ' | ' ,`address`) as text")
                            )
                            ->where('is_deleted',0);

                if ($val !== "") {
                    $results->where(DB::raw("CONCAT(customer_name, ' | ' ,`address`)"),'like',"%" . $val . "%");
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

    public function get_models_for_ship()
    {
        $data = [];
        try {
            $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')
                    ->select([
                        DB::raw("p.model_id as model_id"),
                        DB::raw("m.model as model"),
                        DB::raw("m.box_count_per_pallet as box_qty"),
                        DB::raw("m.hs_count_per_box as hs_qty_per_box"),
                        DB::raw("(m.hs_count_per_box * m.box_count_per_pallet) as hs_qty")
                    ])
                    ->join('pallet_model_matrices as m','p.model_id','=','m.id')
                    ->where('p.pallet_location','WAREHOUSE')
                    ->distinct();

            return Datatables::of($query)->make(true);
        } catch (\Throwable $th) {
            //throw $th;
        }

        return $data;
    }

    public function get_pallets(Request $req)
    {
        $query = DB::connection('mysql')->table('pallet_box_pallet_hdrs as p')->select([
            DB::raw("p.id as id"),
            DB::raw("p.model_id as model_id"),
            DB::raw("m.model as model"),
            DB::raw("p.pallet_qr as pallet_qr"),
            DB::raw("count(b.box_qr) as box_qty"),
            DB::raw("sum(ins.qty) as hs_qty")
            
        ])
        ->join('pallet_model_matrices as m','p.model_id','=','m.id')
        ->join('pallet_box_pallet_dtls as b', function($join) {
            $join->on('p.id', '=', 'b.pallet_id');
            $join->on('b.is_deleted','=', DB::raw(0));
        })
        ->join('tinspectionsheetprintdata as ins', function($join) {
            $join->on('ins.BoxSerialNo', '=', 'b.box_qr');
            $join->on('ins.fec_part_no','=', 'm.model');
        })
        ->where('p.pallet_location','=','WAREHOUSE')
        ->where('p.model_id', $req->model_id)
        ->groupBy('p.id','p.model_id','m.model','p.pallet_qr');

        return Datatables::of($query)->make(true);
    }

    public function get_shipments(Request $req)
    {
        $sql = "SELECT s.id as id,
                    s.control_no as control_no,
                    s.model as model,
                    s.model_id as model_id,
                    s.ship_qty as ship_qty,
                    s.pallet_qty as pallet_qty,
                    s.box_qty as box_qty,
                    s.broken_pcs_qty as borken_pcs_qty,
                    s.destination as destination,
                    s.`status` as shipment_status,
                    s.shipper as shipper,
                    s.ship_date as ship_date,
                    sum(sd.hs_qty) as total_ship_qty
                FROM shipments as s
                join shipment_details as sd
                on sd.ship_id = s.id
                group by s.id,
                    s.control_no,
                    s.model,
                    s.model_id,
                    s.ship_qty,
                    s.pallet_qty,
                    s.box_qty,
                    s.broken_pcs_qty,
                    s.destination,
                    s.`status`,
                    s.shipper,
                    s.ship_date";

        $query = DB::select($sql);
        return Datatables::of($query)->make(true);
    }

    public function get_shipment_details(Request $req)
    {
        $query = ShipmentDetail::where('ship_id',$req->id);
        return Datatables::of($query)->make(true);
    }

    public function save_transaction(Request $req)
    {
        $data = [
			'msg' => 'Saving Transaction has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        if (isset($req->id)) {
            try {
                DB::beginTransaction();

                $ship = Shipment::find($req->id);

                $ship->model_id = $req->model_id;
                $ship->model = $req->model;
                $ship->shipper = $req->warehouse_pic;
                $ship->destination = $req->destination;
                $ship->ship_qty = $req->ship_qty;
                $ship->pallet_qty = $req->pallet_qty;
                $ship->box_qty = $req->box_qty;
                $ship->broken_pcs_qty = $req->broken_pcs_qty;
                $ship->status = $req->status;
                $ship->update_user = Auth::user()->id;

                if ($ship->update()) {
                    foreach ($req->shipment_details as $key => $sp) {
                        ShipmentDetail::where('id', $sp['id'])->update([
                            'pallet_qr' => $sp['pallet_qr'],
                            'pallet_id' => $sp['pallet_id'],
                            'box_qty' => $sp['box_qty'],
                            'hs_qty' => $sp['hs_qty'],
                            'is_deleted' => 0,
                            'update_user' => Auth::user()->id
                        ]);
                    }

                    DB::commit();

                    $data = [
                        'msg' => 'Shipment Transaction was successfully saved.',
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            } catch (\Throwable $th) {
                DB::rollBack();
                $data = [
                    'msg' => $th->getMessage(),
                    'data' => [],
                    'success' => false,
                    'msgType' => 'error',
                    'msgTitle' => 'Error!'
                ];
            }    
        } else {
            try {

                DB::beginTransaction();

                $ship = new Shipment();

                $control_no = $this->control_no($req->model);
                $ship->control_no = $control_no;
                $ship->model_id = $req->model_id;
                $ship->model = $req->model;
                $ship->shipper = $req->warehouse_pic;
                $ship->destination = $req->destination;
                $ship->ship_qty = $req->ship_qty;
                $ship->pallet_qty = $req->pallet_qty;
                $ship->box_qty = $req->box_qty;
                $ship->broken_pcs_qty = $req->broken_pcs_qty;
                $ship->status = $req->status;
                $ship->create_user = Auth::user()->id;
                $ship->update_user = Auth::user()->id;

                if ($ship->save()) {
                    foreach ($req->shipment_details as $key => $sp) {
                        ShipmentDetail::create([
                            'ship_id' => $ship->id,
                            'pallet_qr' => $sp['pallet_qr'],
                            'pallet_id' => $sp['pallet_id'],
                            'box_qty' => $sp['box_qty'],
                            'hs_qty' => $sp['hs_qty'],
                            'is_deleted' => 0,
                            'create_user' => Auth::user()->id,
                            'update_user' => Auth::user()->id
                        ]);
                    }

                    DB::commit();

                    $data = [
                        'msg' => 'Shipment Transaction was successfully saved.',
                        'data' => [],
                        'success' => true,
                        'msgType' => 'success',
                        'msgTitle' => 'Success!'
                    ];
                }
            
            } catch (\Throwable $th) {
                DB::rollBack();
                $data = [
                    'msg' => $th->getMessage(),
                    'data' => [],
                    'success' => false,
                    'msgType' => 'error',
                    'msgTitle' => 'Error!'
                ];
            } 
        }

        return response()->json($data);
    }

    public function delete_transaction(Request $req)
    {
        $data = [
			'msg' => 'Deleting Transaction has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $ship = Shipment::find($req->id);
            $ship->status = $req->status;
            $ship->update_user = Auth::user()->id;

            if ($ship->update()) {
                $data = [
                    'msg' => 'Shipment Transaction was successfully deleted.',
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function complete_transaction(Request $req)
    {
        $data = [
			'msg' => 'Completing Transaction has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $ship = Shipment::find($req->id);
            $ship->status = $req->status;
            $ship->update_user = Auth::user()->id;

            if ($ship->update()) {
                $data = [
                    'msg' => 'Shipment Transaction was successfully completed.',
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function cancel_shipment(Request $req)
    {
        $data = [
			'msg' => 'Canceling Shipment has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {

            DB::beginTransaction();

            $update = DB::table('shipments')->whereIn('id',$req->ids)
                        ->update([
                            'status' => $req->status,
                            'update_user' => Auth::user()->id,
                            'updated_at' => date('Y-m-d H:i:s')
                        ]);

            if ($update) {
                DB::commit();
                $data = [
                    'msg' => 'Shipment was successfully cancelled.',
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }

    public function finish_shipment(Request $req)
    {
        $data = [
			'msg' => 'Finishing Shipment has failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            DB::beginTransaction();

            $update = DB::table('shipments')->whereIn('id',$req->ids)
                        ->update([
                            'status' => $req->status,
                            'ship_date' => date('Y-m-d H:i:s'),
                            'update_user' => Auth::user()->id,
                            'updated_at' => date('Y-m-d H:i:s')
                        ]);

            if ($update) {
                DB::commit();
                $data = [
                    'msg' => 'Shipment was successfully finished.',
                    'data' => [],
                    'success' => true,
                    'msgType' => 'success',
                    'msgTitle' => 'Success!'
                ];
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => 'Error!'
            ];
        }

        return response()->json($data);
    }


    private function control_no($model)
    {
        try {
            $control_no = "";

            $query = DB::connection('mysql')->select("select concat('FTL',date_format(now(), '%y%m%d'),'".$model."','-',LPAD((SELECT count(id) from shipments)+1,4,0)) as control_no");
            $count = count($query);
            if ($count > 0) {
                $control_no = $query[0]->control_no;
            }

            return $control_no;
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
