<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletBoxPalletHdr extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'transaction_id',
        'model_id',
        'pallet_qr',
        'pallet_status',
        'pallet_location',
        'create_user',
        'update_user'
    ];
}
