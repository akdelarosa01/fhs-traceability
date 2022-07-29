<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PalletPageAccess extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'user_id',
        'page_id',
        'status',
        'read_only',
        'read_and_write',
        'delete',
        'authorize',
        'create_user',
        'update_user'
    ];

    public function menu_list($user_id)
    {
        $pages = DB::connection('mysql')->table('pallet_page_accesses as pa')
                    ->join('pallet_pages as p', 'p.id', '=', 'pa.page_id')
                    ->where('pa.user_id', $user_id)
                    ->where('pa.read_and_write',1)
                    ->orWhere('pa.read_only',1)
                    ->select(
                        'p.*',
                        'pa.status',
                        'pa.read_only',
                        'pa.read_and_write',
                        'pa.delete',
                        'pa.authorize'
                    )
                    ->orderBy('order')
                    ->get();
        return $pages;
    }

    public function check_permission($user_id, $page_name)
    {
        return DB::connection('mysql')->table('pallet_page_accesses as pa')
                    ->join('pallet_pages as p', 'p.id', '=', 'pa.page_id')
                    ->where([
                        ['pa.user_id', '=', $user_id],
                        ['pa.authorize', '=', 1],
                        ['p.page_name', '=', $page_name]
                    ])->count();
    }
}
