<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQaInspectedBoxesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qa_inspected_boxes', function (Blueprint $table) {
            $table->id();
            $table->integer('pallet_id')->default(0);
            $table->integer('box_id')->default(0);
            $table->text('box_qr')->nullable();
            $table->date('date_manufactured')->nullable();
            $table->date('date_expired')->nullable();
            $table->string('customer_pn')->length(50)->nullable();
            $table->text('lot_no')->nullable();
            $table->string('prod_line_no')->length(50)->nullable();
            $table->string('carton_no')->length(50)->nullable();
            $table->double('qty_per_box',20,2)->default(0);
            $table->text('inspection_sheet_qr')->nullable();
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
        Schema::dropIfExists('qa_inspected_boxes');
    }
}
