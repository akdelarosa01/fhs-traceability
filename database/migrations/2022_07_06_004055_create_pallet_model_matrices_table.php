<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletModelMatricesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallet_model_matrices', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('model');
            $table->string('model_name');
            $table->double('box_count_per_pallet',10,2)->default(0);
            $table->integer('is_deleted')->length(1)->default(0);
            $table->integer('create_user')->default(0);
            $table->integer('update_user')->default(0);
            $table->index(['id', 'model']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pallet_model_matrices');
    }
}
