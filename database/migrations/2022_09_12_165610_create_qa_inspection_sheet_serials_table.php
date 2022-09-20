<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQaInspectionSheetSerialsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qa_inspection_sheet_serials', function (Blueprint $table) {
            $table->id();
            $table->integer('box_id')->default(0);
            $table->string('box_qr');
            $table->string('hs_serial');
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
        Schema::dropIfExists('qa_inspection_sheet_serials');
    }
}
