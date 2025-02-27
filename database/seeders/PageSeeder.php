<?php

namespace Database\Seeders;

use App\Models\PalletPage;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * Master Pages
         */
        PalletPage::create([
        	'page_name' => 'MasterMaintenance',
        	'page_label' => 'Master Maintenance',
        	'url' => '#',
        	'has_sub' => 1,
            'parent_menu' => '0',
            'parent_name' => '0',
            'parent_order' => 500,
            'order' => 500,
            'icon' => 'fa fa-cogs',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'UsersMaster',
        	'page_label' => 'Users Master',
        	'url' => '/masters/users',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 1,
            'icon' => 'fa fa-user',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'PageMaster',
        	'page_label' => 'Page Master',
        	'url' => '/masters/page',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 2,
            'icon' => 'fa fa-file',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'CustomersMaster',
        	'page_label' => 'Customers Master',
        	'url' => '/masters/customers',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 3,
            'icon' => 'fa fa-users',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'QADispositionsMaster',
        	'page_label' => 'QA Disposition',
        	'url' => '/masters/qa-disposition',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 4,
            'icon' => 'fa fa-search',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'DispositionReasonMaster',
        	'page_label' => 'Disposition Reasons',
        	'url' => '/masters/disposition-reasons',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 5,
            'icon' => 'fa fa-comments',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'BoxPalletModelMatrixMaster',
        	'page_label' => 'Box Pallet Model Matrix',
        	'url' => '/masters/model-matrix',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 6,
            'icon' => 'fa fa-cubes',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'HeatSinkNGReasonMaster',
        	'page_label' => 'Heat Sink NG Reasons',
        	'url' => '/masters/heat-sink-ng-reasons',
        	'has_sub' => 0,
            'parent_menu' => 'MasterMaintenance',
            'parent_name' => 'MasterMaintenance',
            'parent_order' => 0,
            'order' => 7,
            'icon' => 'fa fa-comments',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        /**
         * Transaction Pages
         */
        PalletPage::create([
        	'page_name' => 'BoxAndPalletApplication',
        	'page_label' => 'Box And Pallet',
        	'url' => '/transactions/box-and-pallet',
        	'has_sub' => 0,
            'parent_menu' => '0',
            'parent_name' => '0',
            'parent_order' => 100,
            'order' => 100,
            'icon' => 'fas fa-box',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'QAInspection',
        	'page_label' => 'QA Inspection',
        	'url' => '/transactions/qa-inspection',
        	'has_sub' => 0,
            'parent_menu' => '0',
            'parent_name' => '0',
            'parent_order' => 200,
            'order' => 200,
            'icon' => 'fa fa-search',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'Warehouse',
        	'page_label' => 'Warehouse',
        	'url' => '/transactions/warehouse',
        	'has_sub' => 0,
            'parent_menu' => '0',
            'parent_name' => '0',
            'parent_order' => 300,
            'order' => 300,
            'icon' => 'fa fa-warehouse',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'Reports',
        	'page_label' => 'Reports',
        	'url' => '#',
        	'has_sub' => 1,
            'parent_menu' => '0',
            'parent_name' => '0',
            'parent_order' => 400,
            'order' => 400,
            'icon' => 'fas fa-file',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'BoxAndPalletDataSearch',
        	'page_label' => 'Box And Pallet Data Search',
        	'url' => '/reports/box-pallet-data-search',
        	'has_sub' => 0,
            'parent_menu' => 'Reports',
            'parent_name' => 'Reports',
            'parent_order' => 400,
            'order' => 1,
            'icon' => 'fa fa-chart-column',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'PalletTrackingHistory',
        	'page_label' => 'Pallet Tracking History',
        	'url' => '/reports/pallet-tracking-history',
        	'has_sub' => 0,
            'parent_menu' => 'Reports',
            'parent_name' => 'Reports',
            'parent_order' => 400,
            'order' => 2,
            'icon' => 'fa fa-chart-bar',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);

        PalletPage::create([
        	'page_name' => 'QADataQuery',
        	'page_label' => 'QA Data Query',
        	'url' => '/reports/qa-data-query',
        	'has_sub' => 0,
            'parent_menu' => 'Reports',
            'parent_name' => 'Reports',
            'parent_order' => 400,
            'order' => 3,
            'icon' => 'fa fa-chart-line',
            'is_deleted' => 0,
        	'create_user' => 1,
        	'update_user' => 1
        ]);
    }
}
