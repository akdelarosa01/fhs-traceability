<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
        	'firstname' => 'Kurt',
        	'lastname' => 'Dela Rosa',
        	'username' => 'admin',
        	'email' => "ak.delarosa01@gmail.com",
            'password' => Hash::make('1234567890'),
            'active' => 1,
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);
    }
}
