<?php

namespace Database\Seeders;

use App\Models\PalletModelMatrix;
use Illuminate\Database\Seeder;

class ModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        PalletModelMatrix::create([
        	'model' => 'HS10554',
            'model_name' => 'FDM',
            'box_count_per_pallet' => 20,
            'box_count_to_inspect' => 5,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10555',
            'model_name' => 'FDS',
            'box_count_per_pallet' => 32,
            'box_count_to_inspect' => 5,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10556',
            'model_name' => 'KINGFISHER',
            'box_count_per_pallet' => 36,
            'box_count_to_inspect' => 6,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10557',
            'model_name' => 'S8A',
            'box_count_per_pallet' => 48,
            'box_count_to_inspect' => 7,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10679',
            'model_name' => 'S8C',
            'box_count_per_pallet' => 36,
            'box_count_to_inspect' => 6,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10688',
            'model_name' => 'HAYSTACK',
            'box_count_per_pallet' => 32,
            'box_count_to_inspect' => 4,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10730',
            'model_name' => 'MOON',
            'box_count_per_pallet' => 48,
            'box_count_to_inspect' => 7,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10731',
            'model_name' => 'S8I',
            'box_count_per_pallet' => 24,
            'box_count_to_inspect' => 5,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10752',
            'model_name' => 'SERON',
            'box_count_per_pallet' => 32,
            'box_count_to_inspect' => 4,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10761',
            'model_name' => 'NOA19',
            'box_count_per_pallet' => 48,
            'box_count_to_inspect' => 7,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10778',
            'model_name' => 'CONAN',
            'box_count_per_pallet' => 36,
            'box_count_to_inspect' => 5,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10813',
            'model_name' => 'S8Z',
            'box_count_per_pallet' => 24,
            'box_count_to_inspect' => 4,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10914',
            'model_name' => 'S8A',
            'box_count_per_pallet' => 36,
            'box_count_to_inspect' => 6,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10954',
            'model_name' => 'DIORITE FRO',
            'box_count_per_pallet' => 36,
            'box_count_to_inspect' => 3,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS10955',
            'model_name' => 'DIORITE FRG',
            'box_count_per_pallet' => 36,
            'box_count_to_inspect' => 3,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        PalletModelMatrix::create([
        	'model' => 'HS11044',
            'model_name' => 'ASTORIA',
            'box_count_per_pallet' => 24,
            'box_count_to_inspect' => 4,
            'is_deleted' => 0,
            'create_user' => 1,
            'update_user' => 1
        ]);

        
    }
}
