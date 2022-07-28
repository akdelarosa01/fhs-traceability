<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletTransaction extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'model_id',
        'model_status',
        'target_hs_qty',
        'target_no_of_pallet',
        'create_user',
        'update_user'
    ];
}
