<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletPagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallet_pages', function (Blueprint $table) {
            $table->id();
            $table->string('page_name');
            $table->string('page_label');
            $table->string('url')->length(225);
            $table->integer('has_sub')->length(1)->default(0);
            $table->string('parent_menu');
            $table->string('parent_name');
            $table->integer('parent_order')->length(11)->default(0);
            $table->integer('order')->length(11)->default(0);
            $table->string('icon')->nullable()->default('fa fa-circle');
            $table->integer('is_deleted')->length(1)->default(0);
            $table->integer('create_user')->length(1)->default(0);
            $table->integer('update_user')->length(1)->default(0);
            $table->index(['id', 'create_user']);
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
        Schema::dropIfExists('pallet_pages');
    }
}
