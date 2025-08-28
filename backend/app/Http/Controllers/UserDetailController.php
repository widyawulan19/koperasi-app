<?php

namespace App\Http\Controllers;

use App\Models\DetailUser;
use Illuminate\Http\Request;

class UserDetailController extends Controller
{
    public function index()
    {
        return DetailUser::with('user')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $userDetail = DetailUser::create($data);

        return response()->json($userDetail, 201);
    }

    public function show($id)
    {
        return DetailUser::with('user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $userDetail = DetailUser::findOrFail($id);

        $data = $request->validate([
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $userDetail->update($data);

        return response()->json($userDetail);
    }

    public function destroy($id)
    {
        $userDetail = DetailUser::findOrFail($id);
        $userDetail->delete();

        return response()->json(null, 204);
    }
}
