<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletPage extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'page_name',
        'page_label',
        'url',
        'has_sub',
        'parent_menu',
        'parent_order',
        'order',
        'icon',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
