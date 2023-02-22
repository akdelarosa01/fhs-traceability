<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarehouseToShipment extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    
    protected $fillable = [
        'model_id',
        'pallet_qr',
        'pallet_location',
        'is_shipped',
        'shipped_at',
        'create_user',
        'created_at',
        'update_user',
        'updated_at'
    ];
}
