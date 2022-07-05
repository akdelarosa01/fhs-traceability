<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletDispositionReason extends Model
{
    use HasFactory;
    protected $fillable = [
        'disposition',
        'reason',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
