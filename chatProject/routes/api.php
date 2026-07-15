<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group(['prefix'=>'user','namespace'=>'user','as'=>'user.'],function (){
    Route::post('create',[\App\Http\Controllers\api\user\indexController::class,'create'])->name('create');
    Route::post('login',[\App\Http\Controllers\api\user\indexController::class,'login'])->name('login');
});

Route::group(['prefix'=>'room','namespace'=>'room','as'=>'room.'],function (){
    Route::post('create',[\App\Http\Controllers\api\room\indexController::class,'create'])->name('create');
    Route::get('list',[\App\Http\Controllers\api\room\indexController::class,'list'])->name('list');
    Route::post('delete',[\App\Http\Controllers\api\room\indexController::class,'delete'])->name('delete');
});

Route::group(['prefix'=>'message','namespace'=>'message','as'=>'message.'],function (){
    Route::post('create',[\App\Http\Controllers\api\message\indexController::class,'create'])->name('create');
    Route::get('list',[\App\Http\Controllers\api\message\indexController::class,'list'])->name('list');
});
