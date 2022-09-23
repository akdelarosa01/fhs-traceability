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
        'new_box_count',
        'new_box_to_inspect',
        'is_shipped',
        'create_user',
        'update_user'
    ];
}
