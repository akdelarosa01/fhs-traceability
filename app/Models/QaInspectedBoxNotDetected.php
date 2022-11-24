<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaInspectedBoxNotDetected extends Model
{
    use HasFactory;
    protected $connection = 'mysql';
    protected $fillable = [
        'hs_serial',
        'box_id',
        'box_qr',
        'create_user',
        'update_user',
        'created_at',
        'updated_at',
    ];

    
}
