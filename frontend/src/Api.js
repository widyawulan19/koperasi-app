import axios from "axios";

// instance axios
const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// ===== PUBLIC ROUTES =====

// login
export const loginUser = async (email, password) => {
    const response = await API.post("/login", { email, password });
    return response.data; // { access_token, user }
};

// ===== PROTECTED ROUTES =====

// helper untuk header auth
const authHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
};

// ambil user login
export const getUser = async () => {
    const response = await API.get("/user", { headers: authHeader() });
    return response.data;
};

// ambil semua users
export const fetchUsers = async () => {
    const response = await API.get("/users", { headers: authHeader() });
    return response.data;
};

// logout
export const logoutUser = async () => {
    const response = await API.post("/logout", {}, { headers: authHeader() });
    return response.data;
};


// LOANS 
// ambil semua pinjaman
export const fetchLoans = async () => {
    const response = await API.get("/loans", { headers: authHeader() });
    return response.data;
};

// tambah pinjaman
export const addLoan = async (loanData) => {
    const response = await API.post("/loans", loanData, { headers: authHeader() });
    return response.data;
};

// ambil detail pinjaman
export const getLoan = async (id) => {
    const response = await API.get(`/loans/${id}`, { headers: authHeader() });
    return response.data;
};

// ambil loans user yang login
export const fetchMyLoans = async () => {
    const response = await API.get("/my-loans", { headers: authHeader() });
    return response.data.data; // ambil array data
};

//get total loans user
export const fetchTotalLoan = async () => {
    const response = await API.get('/total-loan', { headers: authHeader() });
    return response.data;
}

//get total loan belum lunas
export const fetchPendingLoans = async () => {
    const response = await API.get("/pending-loans", { headers: authHeader() });
    return response.data;
};

//update status loan oleh admin
export const updateStatusLoan = async (id, status) => {
    const response = await API.put(`/loans/${id}/status`, { status }, { headers: authHeader() });
    return response.data;
}
// END LOANS 

// PAYMENTS 
// ambil semua data pelunasan
export const fetchLoanPayments = async () => {
    const response = await API.get("/loan-payments", { headers: authHeader() });
    return response.data; // { success: true, data: [...] }
};

// update status pelunasan (approve/reject)
export const updateLoanPaymentStatus = async (id, status) => {
    const response = await API.put(`/loan-payments/${id}/status`,
        { status },
        { headers: authHeader() }
    );
    return response.data; // { success: true, payment: {...} }
};

// END PAYMENTS 

//SAVINGS
export const fetchMySaving = async () => {
    const response = await API.get("/my-saving", { headers: authHeader() });
    return response.data;
}

//GET TOTAL SAVING
export const fetchTotalSaving = async () => {
    const response = await API.get("/total-saving", { headers: authHeader() });
    return response.data;
}

// Fungsi untuk fetch savings lengkap dengan user detail
export const fetchSavingsWithUserDetails = async () => {
    try {
        const response = await axios.get('/api/savings-with-user-details', {
            headers: authHeader(),
        });
        return response.data; // { success: true, data: [...] }
    } catch (error) {
        console.error("Gagal fetch savings dengan user detail:", error);
        return { success: false, data: [] };
    }
};

// Ambil total saving per tipe dari
export const fetchTotalSavingByType = async () => {
    const response = await API.get("/total-saving-by-type", {
        headers: authHeader(), // pastikan pakai token user login
    });
    return response.data;
};

// Ambil semua simpanan (hanya untuk admin)
export const fetchAllSavings = async () => {
    const response = await API.get("/all-savings", { headers: authHeader() });
    return response.data; // { success: true, data: [...] }
}

// CREATE
export const createSaving = async (data) => {
    const response = await API.post("/savings", data, { headers: authHeader() });
    return response.data;
};

// UPDATE
export const updateSaving = async (id, data) => {
    const response = await API.put(`/savings/${id}`, data, { headers: authHeader() });
    return response.data;
};

// DELETE
export const deleteSaving = async (id) => {
    const response = await API.delete(`/savings/${id}`, { headers: authHeader() });
    return response.data;
};

export default API;
