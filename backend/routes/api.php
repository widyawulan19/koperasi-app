<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\SavingController;
use App\Http\Controllers\UserDetailController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;

// LOGIN PUBLIC
Route::post('/login', [AuthController::class, 'login']);

// ROUTE PROTECTED
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::get('/users', [UsersController::class, 'index']);
    Route::get('/user-details', [UserDetailController::class, 'index']);
});

//LOAN(PINJAMAN)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::get('/loans/{id}', [LoanController::class, 'show']);
    Route::get('/my-loans', [LoanController::class, 'myLoans']);
    Route::get('/total-loan', [LoanController::class, 'totalLoan']);
    Route::get('/pending-loans', [LoanController::class, 'pendingLoans']);
    Route::put('/loans/{id}/status', [LoanController::class, 'updateStatusLoan']);
});

// LOAN PAYMENTS 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/loan-payments', [PaymentController::class, 'index']);
    Route::put('/loan-payments/{id}/status', [PaymentController::class, 'updateStatus']);
});

//SAVING 
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-saving', [SavingController::class, 'mySaving']);
    Route::get('/total-saving', [SavingController::class, 'totalSavings']);
    Route::get('/total-saving-by-type', [SavingController::class, 'totalByType']);
    Route::get('/savings-with-user-details', [SavingController::class, 'getSavingsWithUserDetails']);
    // Endpoint admin untuk semua simpanan
    Route::get('/all-savings', [SavingController::class, 'allSavings']);
    Route::post('/savings', [SavingController::class, 'store']);
    Route::put('/savings/{id}', [SavingController::class, 'update']);
    Route::delete('/savings/{id}', [SavingController::class, 'destroy']);
});
