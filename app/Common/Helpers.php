<?php

namespace App\Common;

use App\Models\Notification;
use App\Models\PalletHeatSinkNgReason;
use App\Models\PalletPageAccess;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
  
class Helpers 
{
    public function getMenuList()
    {
        $data = [
            'data' => [],
            'success' => false,
            'msgType' => 'warning',
            'msgTitle' => "Failed!",
            'msg' => "Retrieving Menu List has failed."
        ];

        try {
            $user_id = (Auth::check())? Auth::user()->id : 0;
            $page = new PalletPageAccess();
            $list = $page->menu_list($user_id);

            $data = [
                'data' => $list,
                'success' => true,
            ];

        } catch (\Throwable $th) {
            $data = [
                'data' => [],
                'success' => false,
                'msgType' => 'error',
                'msgTitle' => "Error!",
                'msg' => $th->getMessage()
            ];
        }
        return response()->json($data);
    }

    public function get_inputs($req)
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

    public function lot_no(array $box_qr)
    {
        $data = [];
        $serials = [];

        try {
            $hs_serials = DB::connection('mysql')->table('tboxqr as bqr')
                            ->select('bqrd.HS_Serial')
                            ->join('tboxqrdetails as bqrd','bqrd.Box_ID','=','bqr.ID')
                            ->whereIn('bqr.qrBarcode',$box_qr);

            $hs_serial_count = $hs_serials->count();

            if ( $hs_serial_count > 0) {
                $hs_serials = $hs_serials->get();
                

                foreach ($hs_serials as $key => $hs) {
                    array_push($serials,$hs->HS_Serial);
                }

                // get data from china DB
                $data = DB::connection('ftl_china')->table('barcode')
                            ->select('c9 as lot_no')
                            ->whereIn('c4',$serials)
                            ->distinct()->get();

                
            }
        } catch (\Throwable $th) {
            throw $th;
        }

        return $data;
    }

    public function get_permission($user_id, $page_name)
    {
        $permission = DB::connection('mysql')->table('pallet_page_accesses as pa')
                        ->join('pallet_pages as p', 'p.id', '=', 'pa.page_id')
                        ->select('pa.read_only','authorize')
                        ->where([
                            ['pa.user_id', '=', $user_id],
                            ['p.page_name', '=', $page_name]
                        ])->first();

        return $permission;
    }

    public function qa_users()
    {
        $data = DB::connection('mysql')->table('pallet_page_accesses as pa')
                    ->join('pallet_pages as p', 'p.id', '=', 'pa.page_id')
                    ->select('pa.user_id')
                    ->where('p.page_name', '=', 'QAInspection')
                    ->get();

        return $data;
    }

    public function prod_users()
    {
        $data = DB::connection('mysql')->table('pallet_page_accesses as pa')
                    ->join('pallet_pages as p', 'p.id', '=', 'pa.page_id')
                    ->select('pa.user_id')
                    ->where('p.page_name', '=', 'BoxAndPalletApplication')
                    ->get();

        return $data;
    }

    public function whs_users()
    {
        $data = DB::connection('mysql')->table('pallet_page_accesses as pa')
                    ->join('pallet_pages as p', 'p.id', '=', 'pa.page_id')
                    ->select('pa.user_id')
                    ->where('p.page_name', '=', 'Warehouse')
                    ->get();

        return $data;
    }

    public function show_notification(Request $req)
    {
        $data = [
            'data' => [],
            'success' => true,
        ];

        $user_id = $req->session()->get('user_id');

        $noti = DB::connection('mysql')->table('notifications')
                    ->whereNull('read_at')
                    ->where('to',$user_id);

        if ($noti->count() > 0) {
            $data = [
                'data' => $noti->get(),
                'success' => true,
            ];
        }

        return response()->json($data);
    }

    public function read_notification(Request $req)
    {
        $data = [
            'data' => [],
            'success' => true,
        ];

        $noti = DB::connection('mysql')->table('notifications')
                    ->whereNull('read_at')
                    ->where('noti_type',$req->noti_type)
                    ->update([
                        'read_at' => date('Y-m-d H:i:s')
                    ]);

        if ($noti) {
            $data = [
                'data' => [],
                'success' => true,
            ];
        }

        return response()->json($data);
    }

    public function authenticate(Request $req)
    {
        $data = [
			'msg' => 'Checking Authorization was failed.',
            'data' => [],
			'success' => true,
            'msgType' => 'warning',
            'msgTitle' => 'Failed!'
        ];

        try {
            $auth_type = $req->authentication_type;
            $page_access = new PalletPageAccess();
            $permission = 0;

            $user = User::where('username',$req->username)->first();

            if ($user->count()) {
                if (Hash::check($req->password, $user->password)) {
                    switch ($auth_type) {
                        case 'broken_pallet':
                            $permission = $page_access->check_permission($user->id, 'BoxAndPalletApplication');
                            break;

                        case 'update_pallet':
                            $permission = $page_access->check_permission($user->id, 'BoxAndPalletApplication');
                            break;
                        
                        default:
                            # code...
                            break;
                    }
                }                
            }

            if ($permission > 0) {
                $data = [
                    'data' => [
                        'permission' => true
                    ],
                    'success' => true,
                ];
            } else {
                $data = [
                    'data' => [
                        'permission' => false
                    ],
                    'success' => true,
                ];
            }

        } catch (\Throwable $th) {
            $data = [
                'msg' => $th->getMessage(),
                'data' => [],
                'success' => true,
                'msgType' => 'warning',
                'msgTitle' => 'Failed!'
            ];
        }

        return response()->json($data);
    }

    public function getHSdefects($defect_id)
    {
        try {
            $defect = PalletHeatSinkNgReason::where('id',$defect_id);
            if ($defect->count() > 0) {
                $defect = $defect->first();

                return $defect->reason;
            }
            return null;
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}