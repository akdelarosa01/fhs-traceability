<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletHistoryHdr extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'pallet_id',
        'pallet_qr',
        'create_user',
        'update_user'
    ];
}
