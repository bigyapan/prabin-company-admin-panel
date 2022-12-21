<?php

use App\Http\Controllers\api\v1\AuthController;
use App\Http\Controllers\api\v1\GrmBrandController;
use App\Http\Controllers\api\v1\GrmContactController;
use App\Http\Controllers\api\v1\GrmContainerController;
use App\Http\Controllers\api\v1\GrmIncotermController;
use App\Http\Controllers\api\v1\GrmPackagingController;
use App\Http\Controllers\api\v1\GrmQuoteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);
Route::apiResource('grm-contacts', GrmContactController::class);
Route::apiResource('grm-containers', GrmContainerController::class);
Route::apiResource('grm-incoterms', GrmIncotermController::class);
Route::apiResource('grm-packagings', GrmPackagingController::class);
Route::apiResource('grm-quotes', GrmQuoteController::class);
Route::apiResource('grm-brands', GrmBrandController::class);
