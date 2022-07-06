<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePalletCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pallet_customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name');
            $table->text('address');
            $table->string('contact_person1')->nullable();
            $table->string('contact_number1')->nullable();
            $table->string('extension1')->nullable();
            $table->string('email1')->nullable();
            $table->string('contact_person2')->nullable();
            $table->string('contact_number2')->nullable();
            $table->string('extension2')->nullable();
            $table->string('email2')->nullable();
            $table->integer('is_deleted')->length(1)->default(0);
            $table->integer('create_user')->default(0);
            $table->integer('update_user')->default(0);
            $table->timestamps();
            $table->index(['id', 'customer_name']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pallet_customers');
    }
}
