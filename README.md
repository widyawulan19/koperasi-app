# Koperasi App

Project Koperasi App dengan **frontend React** dan **backend Laravel** menggunakan **PostgreSQL**.  
Tujuan: setelah clone repo, project bisa langsung dijalankan di lokal.

---

## 1️⃣ Clone Repo
```bash
git clone https://github.com/widyawulan19/koperasi-app.git
cd koperasi-app
```

## STRUKTUR FOLDER 
koperasi-app/
├─ backend/         # Laravel backend
├─ frontend/        # React frontend


## SETUP BACKEND
1. Masuk ke folder backend: -> backend
2. Install dependencies: composer install
3. konfigurasi postgres

Konfigurasi PostgreSQL di file .env:
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=koperasi_db
DB_USERNAME=postgres
DB_PASSWORD=1234


5. generate app key -> php artisan key:generate
6. menjalankan migrasi -> php artisan migrate
7. server laravel -> php artisan serve : Default: http://127.0.0.1:8000


## DUMMY DATA YANG DIPAKAI (POSTGRES)
export database PostgreSQL ke file SQL
buka terminal -> masukkan perintah berikut.

pg_dump -U postgres -d koperasi_db -F c -b -v -f koperasi_db.backup

## Hasilnya: file koperasi_db.backup akan tersimpan di folder saat anda menjalankan perintah itu.

## Import database (kalau pakai file backup):
pg_restore -U postgres -d koperasi_db -v koperasi_db.backup



# SETUP FRONTEND 

## dependency yang harus ada
Package	
1. react	-> Core library React
2. react-dom	 -> Rendering React ke DOM
3. react-router-dom	-> Routing SPA React
4. axios	 -> HTTP client untuk API calls
5. react-icons ->	Paket ikon siap pakai
6. web-vitals	-> Monitoring performa aplikasi
@testing-library/react, @testing-library/dom, @testing-library/jest-dom, @testing-library/user-event

## DEV DEPENDENCY 
Package
1. tailwindcss :	Utility-first CSS framework
2. postcss :	CSS processor (dipakai Tailwind)
3. autoprefixer :	Tambah prefix CSS otomatis untuk browser
4. @tailwindcss/postcss :	Plugin Tailwind untuk PostCSS

## install dependency frontend 
cd frontend 
npm install

## jalankan project 
npm start

## Catatan Tambahan
Pastikan PostgreSQL sudah berjalan sebelum migrate Laravel.
Jika ada error migrasi, cek koneksi .env dan pastikan database koperasi_db sudah dibuat.
Untuk login/logout dan API call, backend menggunakan Laravel Sanctum (jika sudah setup).

## akses login 
1. admin
   - email : admin@koperasi.com
   - pass: password
3. karyawan
   - email : budi@koperasi.com
   - pass : password
