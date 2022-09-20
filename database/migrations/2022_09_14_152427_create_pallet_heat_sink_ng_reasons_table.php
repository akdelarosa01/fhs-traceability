<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletHeatSinkNgReasonsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallet_heat_sink_ng_reasons', function (Blueprint $table) {
            $table->id();
            $table->text('reason');
            $table->integer('is_deleted')->default(0);
            $table->integer('create_user')->default(0);
            $table->integer('update_user')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pallet_heat_sink_ng_reasons');
    }
}
