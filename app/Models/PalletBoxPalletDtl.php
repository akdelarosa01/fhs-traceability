<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletBoxPalletDtl extends Model
{
    use HasFactory;
    protected $fillable = [
        'pallet_id',
        'model_id',
        'box_qr',
        'remarks',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
