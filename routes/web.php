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
        Route::get('/list', [App\Http\Controllers\Masters\UsersMasterController::class, 'user_list'])->name('masters.user-list');
        Route::get('/page-list', [App\Http\Controllers\Masters\UsersMasterController::class, 'page_list'])->name('masters.page-list');
        Route::post('/save-user', [App\Http\Controllers\Masters\UsersMasterController::class, 'save_user'])->name('masters.save-user');
        Route::post('/delete-user', [App\Http\Controllers\Masters\UsersMasterController::class, 'delete_user'])->name('masters.delete-user');
        Route::post('/save-user-access', [App\Http\Controllers\Masters\UsersMasterController::class, 'save_user_access'])->name('masters.save-user-access');
    });

    Route::group(['prefix' => 'page'], function () {
        Route::get('/', [App\Http\Controllers\Masters\PageMasterController::class, 'index'])->name('masters.page');
        Route::get('/list', [App\Http\Controllers\Masters\PageMasterController::class, 'page_list'])->name('masters.page-list');
        Route::post('/save-page', [App\Http\Controllers\Masters\PageMasterController::class, 'save_page'])->name('masters.save-page');
        Route::post('/delete-page', [App\Http\Controllers\Masters\PageMasterController::class, 'delete_page'])->name('masters.delete-page');
    });

    Route::group(['prefix' => 'customers'], function () {
        Route::get('/', [App\Http\Controllers\Masters\CustomerMasterController::class, 'index'])->name('masters.customers');
    });

    Route::group(['prefix' => 'qa-disposition'], function () {
        Route::get('/', [App\Http\Controllers\Masters\QADispositionMasterController::class, 'index'])->name('masters.qa-disposition');
    });

    Route::group(['prefix' => 'disposition-reasons'], function () {
        Route::get('/', [App\Http\Controllers\Masters\DispositionReasonMasterController::class, 'index'])->name('masters.disposition-reasons');
    });

    Route::group(['prefix' => 'model-matrix'], function () {
        Route::get('/', [App\Http\Controllers\Masters\BoxPalletModelMatrixrMasterController::class, 'index'])->name('masters.model-matrix');
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
    });

    Route::group(['prefix' => 'qa-inspection'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\QAInspectionController::class, 'index'])->name('transactions.qa-inspection');
    });

    Route::group(['prefix' => 'warehouse'], function () {
        Route::get('/', [App\Http\Controllers\Transactions\WarehouseController::class, 'index'])->name('transactions.warehouse');
    });
});