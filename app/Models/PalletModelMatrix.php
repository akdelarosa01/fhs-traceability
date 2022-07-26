<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletModelMatrix extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    
    protected $fillable = [
        'model',
        'model_name',
        'box_count_per_pallet',
        'box_count_to_inspect',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
