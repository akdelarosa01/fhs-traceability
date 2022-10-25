<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QaChangeJudgmentReason extends Model
{
    use HasFactory;

    protected $connection = 'mysql';

    protected $fillable = [
        'pallet_id',
        'box_id',
        'hs_serial',
        'orig_judgment',
        'new_judgment',
        'reason',
        'create_user',
    ];
}
