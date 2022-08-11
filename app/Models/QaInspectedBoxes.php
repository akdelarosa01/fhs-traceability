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
        'box_qr_judgement',
        'box_judgement',
        'remarks',
        'inspector',
        'create_user',
        'update_user'
    ];
}
