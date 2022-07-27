<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletDispositionReasonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mysql')->create('pallet_disposition_reasons', function (Blueprint $table) {
            $table->id();
            $table->integer('disposition')->default(0);
            $table->text('reason');
            $table->integer('is_deleted')->length(1)->default(0);
            $table->integer('create_user')->default(0);
            $table->integer('update_user')->default(0);
            $table->timestamps();
            $table->index(['id', 'disposition']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('mysql')->dropIfExists('pallet_disposition_reasons');
    }
}
