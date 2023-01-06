<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    
    protected $fillable = [
        'control_no',
        'model',
        'model_id',
        'ship_qty',
        'pallet_qty',
        'box_qty',
        'broken_pcs_qty',
        'status',
        'shipper',
        'destination',
        'ship_date',
        'create_user',
        'update_user'
    ];
}
