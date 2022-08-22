<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaHoldLot extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'pallet_id',
        'lot_no',
        'create_user',
        'update_user'
    ];
}
