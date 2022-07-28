<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQaAffectedSerialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qa_affected_serials', function (Blueprint $table) {
            $table->id();
            $table->integer('pallet_id')->default(0);
            $table->integer('box_id')->default(0);
            $table->text('hs_serial');
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
        Schema::dropIfExists('qa_affected_serials');
    }
}
