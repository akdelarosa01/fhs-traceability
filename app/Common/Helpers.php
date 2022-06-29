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
}