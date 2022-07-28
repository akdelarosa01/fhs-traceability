<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletPrintPalletLabelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mysql')->create('pallet_print_pallet_labels', function (Blueprint $table) {
            $table->id();
            $table->string('month');
            $table->string('model');
            $table->text('lot_no');
            $table->double('box_qty',10,2)->default(0);
            $table->text('box_qr');
            $table->string('pallet_qr');
            $table->dateTime('print_date');
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
        Schema::connection('mysql')->dropIfExists('pallet_print_pallet_labels');
    }
}
