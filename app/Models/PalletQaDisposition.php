<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletQaDisposition extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    
    protected $fillable = [
        'disposition',
        'color_hex',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
