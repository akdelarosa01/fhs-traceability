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
            $table->text('box_qr');
            $table->integer('box_qr_judgement')->length(1)->default(-1);
            $table->integer('box_judgement')->length(1)->default(0);
            $table->text('remarks')->nullable();
            $table->string('inspector')->nullable()->length(100);
            $table->integer('create_user')->default(0);
            $table->integer('updated_user')->default(0);
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
