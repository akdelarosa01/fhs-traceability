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
        Schema::connection('mysql')->create('pallet_box_pallet_dtls', function (Blueprint $table) {
            $table->id();
            $table->integer('pallet_id');
            $table->integer('model_id');
            $table->text('box_qr');
            $table->text('remarks')->nullable();
            $table->integer('is_deleted')->length(1)->default(0);
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
        Schema::connection('mysql')->dropIfExists('pallet_box_pallet_dtls');
    }
}
