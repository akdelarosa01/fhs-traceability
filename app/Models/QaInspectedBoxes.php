<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaInspectedBoxes extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    protected $fillable = [
        'pallet_id',
        'box_id',
        'box_qr',
        'date_manufactured',
        'date_expired',
        'customer_pn',
        'lot_no',
        'prod_line_no',
        'carton_no',
        'qty_per_box',
        'inspector',
        'shift',
        'inspection_sheet_qr',
        'create_user',
        'update_user'
    ];
}
