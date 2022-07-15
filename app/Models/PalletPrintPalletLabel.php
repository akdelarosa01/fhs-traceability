<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletPrintPalletLabel extends Model
{
    use HasFactory;
    protected $fillable = [
        'model',
        'lot_no',
        'box_qty',
        'box_qr',
        'pallet_qr',
        'print_date'
    ];
}
