<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletHistoryDtl extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    
    protected $fillable = [
        'history_id',
        'pallet_id',
        'pallet_qr',
        'box_id',
        'box_no'
    ];
}
