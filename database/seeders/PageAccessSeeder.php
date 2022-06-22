<?php

namespace Database\Seeders;

use App\Models\PalletPage;
use App\Models\PalletPageAccess;
use Illuminate\Database\Seeder;

class PageAccessSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pages = PalletPage::all();

        foreach ($pages as $key => $page) {
            PalletPageAccess::create([
                'user_id' => 1,
                'page_id' => $page->id,
                'status' => 1,
                'read_and_write' => 1,
                'delete' => 1,
                'authorize' => 1,
                'create_user' => 1,
                'update_user' => 1
            ]);
        }
    }
}
