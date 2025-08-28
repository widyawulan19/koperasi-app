<?php

namespace App\Http\Controllers;

use App\Models\DetailUser;
use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $loans = Loan::select(
            'loans.id',
            'loans.amount',
            'loans.status',
            'loans.created_at',
            'users.name as user_name',
            'user_details.phone',
            'user_details.address'
        )
            ->join('users', 'loans.user_id', '=', 'users.id')
            ->leftJoin('user_details', 'users.id', '=', 'user_details.user_id')
            ->get();

        return response()->json($loans);
    }

    // GET data pinjaman berdasarkan user id (tanggal pengajuan, jumlah(amount), status)
    public function myLoans(Request $request)
    {
        $userId = $request->user()->id;

        $loans = Loan::where('user_id', $userId)
            ->select('id', 'amount', 'status', 'created_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $loans
        ]);
    }

    //GET TOTAL PINJAMAN USER
    public function totalLoan(Request $request)
    {
        $userId = $request->user()->id;
        $total = Loan::where('user_id', $userId)->sum('amount');

        return response()->json([
            'user_id' => $userId,
            'total_loan' => $total
        ]);
    }

    // GET jumlah pinjaman belum lunas user
    public function pendingLoans(Request $request)
    {
        $userId = $request->user()->id;

        // Asumsi ada kolom 'status' di tabel loans
        $pendingCount = Loan::where('user_id', $userId)
            ->where('status', '!=', 'lunas')
            ->count();

        return response()->json([
            'user_id' => $userId,
            'pending_loans' => $pendingCount
        ]);
    }


    //SIMPAN PINJAMAN BARU
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric',
            // 'status' => 'required|in:pending,approved,rejected,paid',
            'phone' => 'nullable|string',
            'address' => 'nullable|string'
        ]);

        //update user detail (phone & address)
        $userDetail = DetailUser::updateOrCreate(
            ['user_id' => $validated['user_id']],
            ['phone' => $validated['phone'], 'address' => $validated['address']]
        );

        // simpan pinjaman 
        $loans = Loan::create([
            'user_id' => $validated['user_id'],
            'amount' => $validated['amount'],
            'status' => 'applied',
        ]);

        return response()->json([
            'success' => true,
            'loan' => $loans
        ], 201);
    }

    /**
     * tampilkan data pinjam(loans)
     */
    public function show($id)
    {
        $loan = Loan::with('user.userDetail', 'approvedBy')->findOrFail($id);

        return response()->json([
            'success' => true,
            'loan' => $loan
        ]);
    }


    /**
     * UPDATE STATUS LOAN BY ADMIN
     */
    public function updateStatusLoan(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:applied,approved,rejected',
        ]);

        $loans = Loan::findOrFail($id);

        //hanya admin yang bisa update status
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $loans->status = $request->status;
        $loans->approved_by = $request->status === 'applied' ? null : $request->user()->id;
        $loans->approved_at = $request->status !== 'applied' ? now() : null;
        $loans->save();

        return response()->json([
            'success' => true,
            'loan' => $loans
        ]);
    }
}
