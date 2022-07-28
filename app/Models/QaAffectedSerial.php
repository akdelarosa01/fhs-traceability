<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaAffectedSerial extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'pallet_id',
        'box_id',
        'hs_serial',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
