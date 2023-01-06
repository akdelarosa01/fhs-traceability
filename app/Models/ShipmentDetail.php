<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentDetail extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    
    protected $fillable = [
        'ship_id',
        'pallet_qr',
        'pallet_id',
        'box_qty',
        'hs_qty',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
