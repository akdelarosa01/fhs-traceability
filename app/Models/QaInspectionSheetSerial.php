<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaInspectionSheetSerial extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    protected $fillable = [
        'box_id',
        'box_qr',
        'hs_serial',
        'create_user',
        'update_user'
    ];
}
