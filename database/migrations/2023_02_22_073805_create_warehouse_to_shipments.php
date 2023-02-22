<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWarehouseToShipments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('warehouse_to_shipments', function (Blueprint $table) {
            $table->id()->primary();
            $table->integer('model_id');
            $table->string('pallet_qr');
            $table->string('pallet_location');
            $table->boolean('is_shipped')->default(0);
            $table->timestamp('shipped_at')->nullable();
            $table->integer('create_user')->nullable();
            $table->timestamp('create_date')->nullable();
            $table->integer('update_user')->nullable();
            $table->timestamp('update_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('warehouse_to_shipments');
    }
}
