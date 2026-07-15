<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('rm_id');
            $table->string('rm_name')->nullable();
            $table->string('rm_user')->nullable()->comment("Hangi kullanıcı odayı oluşturmuş ise onun token numarası");
            $table->softDeletes();
            $table->timestamp('rm_created_at')->nullable();
            $table->timestamp('rm_updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
