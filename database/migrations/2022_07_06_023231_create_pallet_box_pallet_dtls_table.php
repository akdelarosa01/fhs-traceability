<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletBoxPalletDtlsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallet_box_pallet_dtls', function (Blueprint $table) {
            $table->id();
            $table->integer('pallet_id');
            $table->integer('model_id');
            $table->text('box_qr');
            $table->integer('create_user')->default(0);
            $table->integer('update_user')->default(0);
            $table->timestamps();
            $table->index(['id', 'pallet_id','model_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pallet_box_pallet_dtls');
    }
}
