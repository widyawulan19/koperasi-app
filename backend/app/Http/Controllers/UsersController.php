<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UsersController extends Controller
{
    public function index()
    {
        try {
            // Ambil semua user
            $users = User::all();

            // Serialisasi aman: handle null created_at / updated_at
            $users = $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at ? $user->created_at->toDateTimeString() : null,
                    'updated_at' => $user->updated_at ? $user->updated_at->toDateTimeString() : null,
                ];
            });

            if ($users->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No users found',
                    'data' => []
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Success get users data',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get users data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
