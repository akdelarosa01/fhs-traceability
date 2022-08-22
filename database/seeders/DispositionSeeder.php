<?php

namespace Database\Seeders;

use App\Models\PalletQaDisposition;
use Illuminate\Database\Seeder;

class DispositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        PalletQaDisposition::create([
            'disposition' => 'FOR OBA',
            'color_hex' => '#FFC4DD',
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);
        
        PalletQaDisposition::create([
            'disposition' => 'GOOD',
            'color_hex' => '#00ACAC',
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletQaDisposition::create([
            'disposition' => 'FOR REWORK',
            'color_hex' => '#21E1E1',
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletQaDisposition::create([
            'disposition' => 'HOLD PALLET',
            'color_hex' => '#E64848',
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletQaDisposition::create([
            'disposition' => 'HOLD LOT',
            'color_hex' => '#FF5B57',
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);
    }
}
