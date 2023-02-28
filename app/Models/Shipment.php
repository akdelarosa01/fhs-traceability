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
        'qc_pic',
        'destination',
        'ship_date',
        'create_user',
        'update_user',
        'invoice_no',
        'container_no',
        'truck_plate_no',
        'shipping_seal_no',
        'peza_seal_no'

    ];
}
