<?php

namespace App\Http\Controllers;

use App\Models\Saving;
use Illuminate\Http\Request;

class SavingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    //GET USER DETAIL 
    public function getSavingsWithUserDetails()
    {
        // Ambil semua saving beserta user dan user_detail
        $savings = Saving::with(['user.detail'])->get();

        // Format response sesuai kebutuhan FE
        $data = $savings->map(function ($saving) {
            return [
                'id' => $saving->id,
                'type' => $saving->type,
                'amount' => $saving->amount,
                'profit_share' => $saving->profit_share,
                'date' => $saving->date,
                'user_id' => $saving->user_id,
                'user_name' => $saving->user->name,
                'phone' => $saving->user->detail->phone ?? null,
                'address' => $saving->user->detail->address ?? null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }


    //menampilkan data saving (bulan(date), type,amout, profit_share)-> untuk karyawan
    public function mySaving(Request $request)
    {
        $userId = $request->user()->id;

        $saving = Saving::where('user_id', $userId)
            ->select('id', 'date', 'type', 'amount', 'profit_share')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $saving
        ]);
    }

    //total saving per user
    public function totalSavings(Request $request)
    {
        $userId = $request->user()->id; // ambil user yang login
        $total = Saving::where('user_id', $userId)->sum('amount');

        return response()->json([
            'user_id' => $userId,
            'total_saving' => $total
        ]);
    }

    //total saving per type -> karyawan
    public function totalByType(Request $request)
    {
        $userId = $request->user()->id;


        //1. total saving "wajib"
        $totalWajib = Saving::where('user_id', $userId)
            ->where('type', 'wajib')
            ->sum('amount');

        //2. total saving "pokok"
        $totalPokok = Saving::where('user_id', $userId)
            ->where('type', 'pokok')
            ->sum('amount');

        return response()->json([
            'user_id' => $userId,
            'total_wajib' => $totalWajib,
            'total_pokok' => $totalPokok,
        ]);
    }


    //Menampilkan semua data saving "admin"
    public function allSavings(Request $request)
    {
        // Cek role admin
        if ($request->user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Ambil semua data saving beserta info user
        $savings = Saving::with('user:id,name,email') // relasi ke User
            ->select('id', 'user_id', 'type', 'amount', 'profit_share', 'date', 'created_at', 'updated_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $savings
        ]);
    }

    // CRUD ADMIN 
    // CREATE
    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:wajib,pokok',
            'amount' => 'required|numeric',
            'profit_share' => 'nullable|numeric',
            'date' => 'required|date',
        ]);

        $saving = Saving::create($validated);

        return response()->json(['success' => true, 'saving' => $saving], 201);
    }



    // UPDATE
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $saving = Saving::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:wajib,pokok',
            'amount' => 'required|numeric',
            'profit_share' => 'nullable|numeric',
            'date' => 'required|date',
        ]);

        $saving->update($validated);

        return response()->json(['success' => true, 'saving' => $saving]);
    }

    // DELETE
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $saving = Saving::findOrFail($id);
        $saving->delete();

        return response()->json(['success' => true, 'message' => 'Saving deleted']);
    }
}
