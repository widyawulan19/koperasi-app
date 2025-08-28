<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * get semua data pelunas
     */

    //mengambil semua data payment
    public function index()
    {
        $payments = Payment::with(['loan.user'])->get();
        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    // Update status payment (admin only)
    public function updateStatus(Request $request, $id)
    {
        $user = $request->user();

        // Cek role admin
        if ($user->role !== 'admin') {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        // Validasi status
        $validated = $request->validate([
            'status' => 'required|in:applied,approved,rejected',
        ]);

        $payment = Payment::with('loan')->findOrFail($id);
        $payment->status = $validated['status'];
        $payment->approved_by = $user->id;
        $payment->approved_at = now();
        $payment->save();

        // Cek apakah semua payment loan sudah approved → update loan status jadi 'paid'
        $loan = $payment->loan;
        $totalApproved = $loan->payments()->where('status', 'approved')->sum('amount');
        if ($totalApproved >= $loan->amount) {
            $loan->status = 'paid';
            $loan->save();
        }

        return response()->json([
            'success' => true,
            'payment' => $payment
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        //
    }
}
