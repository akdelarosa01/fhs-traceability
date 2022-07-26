<?php

namespace App\Common;

use App\Models\PalletPageAccess;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
  
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
            $hs_serials = DB::connection('furukawa')->table('furukawa.tboxqr as bqr')
                            ->select('bqrd.HS_Serial')
                            ->join('furukawa.tboxqrdetails as bqrd','bqrd.Box_ID','=','bqr.ID')
                            ->whereIn('bqr.qrBarcode',$box_qr);

            $hs_serial_count = $hs_serials->count();

            if ( $hs_serial_count > 0) {
                $hs_serials = $hs_serials->get();
                

                foreach ($hs_serials as $key => $hs) {
                    array_push($serials,$hs->HS_Serial);
                }

                // get data from china DB
                $data = DB::connection('ftl_china')->table('ftl_china.barcode')
                            ->select('c8 as lot_no')
                            ->whereIn('c4',$serials)
                            ->distinct()->get();

                
            }
        } catch (\Throwable $th) {
            throw $th;
        }

        return $data;
    }
}