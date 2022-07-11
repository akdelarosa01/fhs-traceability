<?php

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
        Route::get('/get-transactions', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'model_transaction_list'])->name('transactions.box-and-pallet.get-transactions');
        Route::post('/proceed', [App\Http\Controllers\Transactions\BoxAndPalletApplicationController::class, 'proceed'])->name('transactions.box-and-pallet.proceed');
    });

    Route::group(['prefix' => 'qa-inspection'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\QAInspectionController::class, 'index'])->name('transactions.qa-inspection');
    });

    Route::group(['prefix' => 'warehouse'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\WarehouseController::class, 'index'])->name('transactions.warehouse');
    });
});