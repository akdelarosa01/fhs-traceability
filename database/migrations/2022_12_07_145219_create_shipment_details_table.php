<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateShipmentDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipment_details', function (Blueprint $table) {
            $table->id();
            $table->integer('ship_id')->default(0);
            $table->integer('pallet_qr');
            $table->integer('pallet_id')->default(0);
            $table->double('ship_qty',20,2);
            $table->double('pallet_qty',20,2);
            $table->double('box_qty',20,2);
            $table->double('broken_pcs_qty',20,2);
            $table->integer('is_deleted')->default(0)->legnth(1);
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
        Schema::dropIfExists('shipment_details');
    }
}
