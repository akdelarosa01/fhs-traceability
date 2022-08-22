<?php

use App\Events\PalletTransferred;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
});

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['prefix' => 'masters'], function () {
    Route::group(['prefix' => 'users'], function () {
        Route::get('/', [App\Http\Controllers\Masters\UsersMasterController::class, 'index'])->name('masters.users');
        Route::get('/list', [App\Http\Controllers\Masters\UsersMasterController::class, 'user_list'])->name('masters.users.list');
        Route::get('/page-list', [App\Http\Controllers\Masters\UsersMasterController::class, 'page_list'])->name('masters.users.page-list');
        Route::post('/save-user', [App\Http\Controllers\Masters\UsersMasterController::class, 'save_user'])->name('masters.users.save');
        Route::post('/delete-user', [App\Http\Controllers\Masters\UsersMasterController::class, 'delete_user'])->name('masters.users.delete');
        Route::post('/save-user-access', [App\Http\Controllers\Masters\UsersMasterController::class, 'save_user_access'])->name('masters.users.save-user-access');
    });

    Route::group(['prefix' => 'page'], function () {
        Route::get('/', [App\Http\Controllers\Masters\PageMasterController::class, 'index'])->name('masters.page');
        Route::get('/list', [App\Http\Controllers\Masters\PageMasterController::class, 'page_list'])->name('masters.page.list');
        Route::post('/save-page', [App\Http\Controllers\Masters\PageMasterController::class, 'save_page'])->name('masters.page.save');
        Route::post('/delete-page', [App\Http\Controllers\Masters\PageMasterController::class, 'delete_page'])->name('masters.page.delete');
    });

    Route::group(['prefix' => 'customers'], function () {
        Route::get('/', [App\Http\Controllers\Masters\CustomerMasterController::class, 'index'])->name('masters.customers');
        Route::get('/list', [App\Http\Controllers\Masters\CustomerMasterController::class, 'customer_list'])->name('masters.customers.list');
        Route::post('/save-customer', [App\Http\Controllers\Masters\CustomerMasterController::class, 'save_customer'])->name('masters.customers.save');
        Route::post('/delete-customer', [App\Http\Controllers\Masters\CustomerMasterController::class, 'delete_customer'])->name('masters.customers.delete');
    });

    Route::group(['prefix' => 'qa-disposition'], function () {
        Route::get('/', [App\Http\Controllers\Masters\QADispositionMasterController::class, 'index'])->name('masters.qa-disposition');
        Route::get('/list', [App\Http\Controllers\Masters\QADispositionMasterController::class, 'disposition_list'])->name('masters.qa-disposition.list');
        Route::post('/save-disposition', [App\Http\Controllers\Masters\QADispositionMasterController::class, 'save_disposition'])->name('masters.qa-disposition.save');
        Route::post('/delete-disposition', [App\Http\Controllers\Masters\QADispositionMasterController::class, 'delete_disposition'])->name('masters.qa-disposition.delete');
    });

    Route::group(['prefix' => 'disposition-reasons'], function () {
        Route::get('/', [App\Http\Controllers\Masters\DispositionReasonMasterController::class, 'index'])->name('masters.disposition-reasons');
        Route::get('/list', [App\Http\Controllers\Masters\DispositionReasonMasterController::class, 'reason_list'])->name('masters.disposition-reasons.list');
        Route::get('/get-dispositions', [App\Http\Controllers\Masters\DispositionReasonMasterController::class, 'get_dispositions'])->name('masters.disposition-reasons.get-dispositions');
        Route::post('/save-reason', [App\Http\Controllers\Masters\DispositionReasonMasterController::class, 'save_reason'])->name('masters.disposition-reasons.save');
        Route::post('/delete-reason', [App\Http\Controllers\Masters\DispositionReasonMasterController::class, 'delete_reason'])->name('masters.disposition-reasons.delete');
    });

    Route::group(['prefix' => 'model-matrix'], function () {
        Route::get('/', [App\Http\Controllers\Masters\BoxPalletModelMatrixController::class, 'index'])->name('masters.model-matrix');
        Route::get('/list', [App\Http\Controllers\Masters\BoxPalletModelMatrixController::class, 'model_matrix_list'])->name('masters.model-matrix.list');
        Route::post('/save-model', [App\Http\Controllers\Masters\BoxPalletModelMatrixController::class, 'save_model'])->name('masters.model-matrix.save');
        Route::post('/delete-model', [App\Http\Controllers\Masters\BoxPalletModelMatrixController::class, 'delete_model'])->name('masters.model-matrix.delete');
    });

    Route::group(['prefix' => 'box-ng-reasons'], function () {
        Route::get('/', [App\Http\Controllers\Masters\BoxNGReasonController::class, 'index'])->name('masters.box-ng-reasons');
        Route::get('/list', [App\Http\Controllers\Masters\BoxNGReasonController::class, 'reason_list'])->name('masters.box-ng-reasons.list');
        Route::post('/save-reason', [App\Http\Controllers\Masters\BoxNGReasonController::class, 'save_reason'])->name('masters.box-ng-reasons.save');
        Route::post('/delete-reason', [App\Http\Controllers\Masters\BoxNGReasonController::class, 'delete_reason'])->name('masters.box-ng-reasons.delete');
    });
});

Route::group(['prefix' => 'reports'], function () {
    Route::group(['prefix' => 'pallet-tracking-history'], function () {
        Route::get('/', [App\Http\Controllers\Reports\PalletTrackingHistoryController::class, 'index'])->name('reports.pallet-tracking-history');
    });

    Route::group(['prefix' => 'shipping-records'], function () {
        Route::get('/', [App\Http\Controllers\Reports\ShippingRecordsController::class, 'index'])->name('reports.shipping-records');
    });
});

Route::group(['prefix' => 'transactions'], function () {
    Route::group(['prefix' => 'box-and-pallet'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'index'])->name('transactions.box-and-pallet');
        Route::get('/get-models', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'get_models'])->name('transactions.box-and-pallet.get-models');
        Route::post('/get-transactions', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'model_transaction_list'])->name('transactions.box-and-pallet.get-transactions');
        Route::post('/proceed', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'proceed'])->name('transactions.box-and-pallet.proceed');
        Route::post('/get-pallets', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'get_pallets'])->name('transactions.box-and-pallet.get-pallets');
        Route::post('/get-boxes', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'get_boxes'])->name('transactions.box-and-pallet.get-boxes');
        Route::post('/save-box', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'save_box'])->name('transactions.box-and-pallet.save-box');
        Route::post('/update-box', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'update_box'])->name('transactions.box-and-pallet.update-box');
        Route::post('/print-pallet', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'print_pallet'])->name('transactions.box-and-pallet.print-pallet');
        Route::get('/print-preview', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'print_preview'])->name('transactions.box-and-pallet.print-preview');
        Route::post('/transfer-to', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'transfer_to'])->name('transactions.box-and-pallet.transfer-to');
        Route::get('/check-authorization', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'check_authorization'])->name('transactions.box-and-pallet.check-authorization');
        Route::post('/set-new-box-count', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'set_new_box_count'])->name('transactions.box-and-pallet.set-new-box-count');
    });

    Route::group(['prefix' => 'qa-inspection'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\QAInspectionController::class, 'index'])->name('transactions.qa-inspection');
        Route::post('/get-pallets', [App\Http\Controllers\Transactions\QAInspectionController::class, 'pallet_list'])->name('transactions.qa-inspection.get-pallets');
        Route::post('/get-boxes', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_boxes'])->name('transactions.qa-inspection.get-boxes');
        Route::post('/check-hs-serial', [App\Http\Controllers\Transactions\QAInspectionController::class, 'check_hs_serial'])->name('transactions.qa-inspection.check-hs-serial');
        Route::post('/get-affected-serial-no', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_affected_serial_no'])->name('transactions.qa-inspection.get-affected-serial-no');
        Route::get('/get-lot-no', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_lot_no'])->name('transactions.qa-inspection.get-lot-no');
        Route::get('/get-box-ng-remarks', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_box_ng_remarks'])->name('transactions.qa-inspection.get-box-ng-remarks');
        Route::post('/box-judgment', [App\Http\Controllers\Transactions\QAInspectionController::class, 'box_judgment'])->name('transactions.qa-inspection.box-judgment');
        Route::post('/set-box-ng-remarks', [App\Http\Controllers\Transactions\QAInspectionController::class, 'set_box_ng_remarks'])->name('transactions.qa-inspection.set-box-ng-remarks');
        Route::post('/scan-hs-serial', [App\Http\Controllers\Transactions\QAInspectionController::class, 'scan_hs_serial'])->name('transactions.qa-inspection.scan-hs-serial');
        Route::get('/get-dispositions', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_dispositions'])->name('transactions.qa-inspection.get-dispositions');
        Route::post('/set-disposition', [App\Http\Controllers\Transactions\QAInspectionController::class, 'set_disposition'])->name('transactions.qa-inspection.set-disposition');
        Route::get('/get-disposition-reasons', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_disposition_reasons'])->name('transactions.qa-inspection.get-disposition-reasons');
        Route::get('/get-pallet-lot', [App\Http\Controllers\Transactions\QAInspectionController::class, 'get_pallet_lot'])->name('transactions.qa-inspection.get-pallet-lot');
        Route::post('/transfer-to', [App\Http\Controllers\Transactions\QAInspectionController::class, 'transfer_to'])->name('transactions.qa-inspection.transfer-to');
    });

    Route::group(['prefix' => 'warehouse'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\WarehouseController::class, 'index'])->name('transactions.warehouse');
    });

    
});

Route::group(['prefix' => 'notifications'], function () {
    Route::get('/show', [App\Common\Helpers::class, 'show_notification'])->name('notifications.show');
    Route::post('/read', [App\Common\Helpers::class, 'read_notification'])->name('notifications.read');
});

Route::post('/authenticate', [App\Common\Helpers::class, 'authenticate'])->name('authenticate');