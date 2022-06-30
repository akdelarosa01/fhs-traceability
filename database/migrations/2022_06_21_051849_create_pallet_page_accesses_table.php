<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletPageAccessesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallet_page_accesses', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->default(0);
            $table->integer('page_id')->default(0);
            $table->integer('status')->default(0)->length(1);
            $table->integer('read_and_write')->default(0)->length(1);
            $table->integer('delete')->default(0)->length(1);
            $table->integer('authorize')->default(0)->length(1);
            $table->integer('create_user')->default(0);
            $table->integer('update_user')->default(0);
            $table->index(['user_id', 'page_id']);
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
        Schema::dropIfExists('pallet_page_accesses');
    }
}
