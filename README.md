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

file .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=koperasi_db
DB_USERNAME=postgres
DB_PASSWORD=1234


5. generate app key -> php artisan key:generate
6. menjalankan migrasi -> php artisan migrate
7. server laravel -> php artisan serve


## DUMMY DATA YANG DIPAKAI (POSTGRES)
export database PostgreSQL ke file SQL
buka terminal -> masukkan perintah berikut
pg_dump -U postgres -d koperasi_db -F c -b -v -f koperasi_db.backup

Hasilnya: file koperasi_db.backup akan tersimpan di folder saat anda menjalankan perintah itu.


# SETUP FRONTEND 

## dependency yang harus ada
Package	
react	-> Core library React
react-dom	 -> Rendering React ke DOM
react-router-dom	-> Routing SPA React
axios	 -> HTTP client untuk API calls
react-icons ->	Paket ikon siap pakai
web-vitals	-> Monitoring performa aplikasi
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
