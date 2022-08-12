<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletBoxNgReason extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    
    protected $fillable = [
        'reason',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
