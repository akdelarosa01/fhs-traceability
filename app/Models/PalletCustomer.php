<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PalletCustomer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'address',
        'contact_person1',
        'contact_number1',
        'extension1',
        'email1',
        'contact_person2',
        'contact_number2',
        'extension2',
        'email2',
        'is_deleted',
        'create_user',
        'update_user'
    ];
}
