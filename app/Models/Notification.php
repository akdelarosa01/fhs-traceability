<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = [
        'noti_type',
        'from',
        'to',
        'title',
        'message',
        'url',
        'read_at',
    ];
}
