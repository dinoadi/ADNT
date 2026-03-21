# Panduan Setup Supabase untuk ADNT Dashboard

## Ringkasan
Anda perlu mengonfigurasi Supabase untuk menggantikan backend server Express. Ini akan memungkinkan aplikasi berjalan di Netlify tanpa server terpisah.

---

## Langkah 1: Konfigurasi Autentikasi Supabase

### 1.1 Buka Dashboard Supabase
1. Buka [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Login ke akun Supabase Anda
3. Pilih project yang sudah ada (atau buat baru jika belum ada)

### 1.2 Aktifkan Email/Password Authentication
1. Di menu sebelah kiri, klik **Authentication**
2. Klik tab **Providers**
3. Cari **Email** dan klik untuk mengaktifkannya
4. Pastikan **Enable Email provider** sudah dicentang

### 1.3 Buat User Admin
1. Di menu **Authentication**, klik **Users**
2. Klik tombol **Add user** (atau **Create user**)
3. Isi data berikut:
   - **Email:** `admin@adnt.com`
   - **Password:** `admin123` (atau password yang Anda inginkan)
   - **Auto Confirm User:** ✅ Centang ini (penting agar tidak perlu konfirmasi email)
4. Klik **Create user**

### 1.4 Nonaktifkan Konfirmasi Email (Opsional tapi Disarankan)
1. Di menu **Authentication**, klik **Providers**
2. Klik **Email**
3. Scroll ke bawah ke bagian **Email Confirmation**
4. Matikan **Confirm email** (untuk demo/testing)
5. Klik **Save**

---

## Langkah 2: Buat Tabel Database

### 2.1 Buka SQL Editor
1. Di menu sebelah kiri, klik **SQL Editor**
2. Klik **New query** untuk membuat query baru

### 2.2 Jalankan SQL Berikut
Copy dan paste kode SQL ini ke SQL Editor, lalu klik **Run**:

```sql
-- Buat tabel customers
CREATE TABLE customers (
  no_rek VARCHAR(255) PRIMARY KEY,
  nama VARCHAR(255),
  no_cif VARCHAR(255),
  saldo_awal FLOAT,
  saldo_akhir FLOAT,
  tagihan_pokok FLOAT,
  tagihan_bunga FLOAT DEFAULT 0,
  tunggakan_pokok FLOAT DEFAULT 0,
  tunggakan_bunga FLOAT DEFAULT 0,
  kolek INTEGER DEFAULT 1,
  tanggal_jt VARCHAR(255),
  status_pinjaman VARCHAR(255),
  payment_status VARCHAR(50) DEFAULT 'BELUM BAYAR' CHECK (payment_status IN ('BELUM BAYAR', 'DONE', 'POTONG MANUAL')),
  no_hp VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Buat index untuk performa query lebih baik
CREATE INDEX idx_customers_tanggal_jt ON customers(tanggal_jt);
CREATE INDEX idx_customers_payment_status ON customers(payment_status);
CREATE INDEX idx_customers_kolek ON customers(kolek);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Buat policy untuk mengizinkan user yang sudah login membaca semua data
CREATE POLICY "Allow authenticated read access" ON customers
  FOR SELECT TO authenticated
  USING (true);

-- Buat policy untuk mengizinkan user yang sudah login mengupdate data
CREATE POLICY "Allow authenticated update access" ON customers
  FOR UPDATE TO authenticated
  USING (true);

-- Buat policy untuk mengizinkan user yang sudah login menambah data
CREATE POLICY "Allow authenticated insert access" ON customers
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Buat policy untuk mengizinkan user yang sudah login menghapus data
CREATE POLICY "Allow authenticated delete access" ON customers
  FOR DELETE TO authenticated
  USING (true);
```

### 2.3 Verifikasi Tabel Dibuat
1. Setelah query berhasil, klik **Table Editor** di menu sebelah kiri
2. Anda harus melihat tabel `customers` di daftar tabel
3. Klik `customers` untuk melihat struktur tabelnya

---

## Langkah 3: Migrasi Data ke Supabase

### Opsi A: Import dari File CSV (Jika Anda punya data dalam CSV)
1. Di **Table Editor**, klik tabel `customers`
2. Klik tombol **Insert** → **Import data from CSV**
3. Upload file CSV yang berisi data nasabah
4. Mapping kolom sesuai dengan struktur tabel
5. Klik **Import**

### Opsi B: Import dari Database Lama (SQLite/PostgreSQL)
1. Export data dari database lama:
   - Jika SQLite: Gunakan tool seperti DB Browser for SQLite
   - Jika PostgreSQL: Gunakan `pg_dump`
2. Convert data ke format CSV atau JSON
3. Import ke Supabase menggunakan SQL Editor atau CSV import

### Opsi C: Insert Manual (Untuk Testing)
Jika Anda hanya ingin testing dulu, bisa insert beberapa data dummy:

```sql
-- Insert data dummy untuk testing
INSERT INTO customers (no_rek, nama, no_cif, saldo_awal, saldo_akhir, tagihan_pokok, tagihan_bunga, tunggakan_pokok, tunggakan_bunga, kolek, tanggal_jt, status_pinjaman, payment_status, no_hp) VALUES
('001', 'Ahmad Santoso', 'CIF001', 5000000, 5000000, 500000, 50000, 0, 0, 1, '2026-03-25', 'AKTIF', 'BELUM BAYAR', '081234567890'),
('002', 'Budi Pratama', 'CIF002', 3000000, 3000000, 300000, 30000, 0, 0, 1, '2026-03-26', 'AKTIF', 'BELUM BAYAR', '081234567891'),
('003', 'Citra Dewi', 'CIF003', 7000000, 7000000, 700000, 70000, 0, 0, 2, '2026-03-27', 'AKTIF', 'BELUM BAYAR', '081234567892');
```

### 3.1 Verifikasi Data
1. Di **Table Editor**, klik tabel `customers`
2. Pastikan data sudah muncul
3. Cek beberapa record untuk memastikan data benar

---

## Langkah 4: Dapatkan Kredensial Supabase

### 4.1 Dapatkan Project URL
1. Di Dashboard Supabase, klik **Settings** (ikon gear) di menu sebelah kiri
2. Klik **API**
3. Copy **Project URL** yang ada di bagian **Project API keys**
4. Contoh: `https://exrycqaqrelwohbafuvo.supabase.co`

### 4.2 Dapatkan Anon Key
1. Di halaman yang sama (Settings → API)
2. Copy **anon public** key
3. Contoh: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4.3 Update Environment Variables di Netlify
1. Buka [Netlify Dashboard](https://app.netlify.com)
2. Pilih site `adnt.netlify.app`
3. Klik **Site settings** → **Environment variables**
4. Tambahkan variabel berikut:
   - **Key:** `VITE_SUPABASE_URL`
   - **Value:** (paste Project URL dari langkah 4.1)
5. Tambahkan variabel kedua:
   - **Key:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** (paste anon key dari langkah 4.2)
6. Klik **Save**
7. Trigger redeploy (klik **Deploy** → **Retry deploy**)

---

## Langkah 5: Verifikasi Setup

### 5.1 Test Koneksi dari Browser
1. Buka browser dan akses `https://adnt.netlify.app`
2. Buka Developer Tools (F12) → Console
3. Jalankan kode berikut di console:
```javascript
const { createClient } = supabase;
const client = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
client.from('customers').select('*').then(console.log);
```
4. Jika berhasil, Anda akan melihat data customers di console

### 5.2 Test Login
1. Buka `https://adnt.netlify.app/login`
2. Login dengan:
   - Email: `admin@adnt.com`
   - Password: `admin123` (atau password yang Anda buat)
3. Jika berhasil, Anda akan diarahkan ke dashboard

---

## Checklist Selesai

Sebelum melanjutkan ke tahap coding, pastikan:

- [ ] Autentikasi Email/Password sudah aktif
- [ ] User admin sudah dibuat
- [ ] Tabel `customers` sudah dibuat
- [ ] RLS policies sudah dikonfigurasi
- [ ] Data sudah di-import ke Supabase
- [ ] Project URL dan Anon Key sudah dicatat
- [ ] Environment variables sudah di-set di Netlify
- [ ] Redeploy Netlify sudah selesai

---

## Troubleshooting

### Masalah: Login Gagal
**Solusi:**
- Pastikan user admin sudah dibuat di Supabase
- Cek apakah email confirmation dimatikan
- Pastikan password benar

### Masalah: Data Tidak Muncul di Dashboard
**Solusi:**
- Cek apakah user sudah login (authenticated)
- Verifikasi RLS policies sudah benar
- Cek console browser untuk error messages

### Masalah: CORS Error
**Solusi:**
- Supabase biasanya handle CORS otomatis
- Pastikan menggunakan URL yang benar (https, bukan http)

### Masalah: Environment Variables Tidak Terbaca
**Solusi:**
- Pastikan nama variabel dimulai dengan `VITE_`
- Redeploy site setelah mengubah environment variables
- Cek di Netlify Dashboard apakah variabel sudah tersimpan

---

## Langkah Selanjutnya

Setelah setup Supabase selesai:

1. **Konfirmasi** kepada saya bahwa setup sudah selesai
2. Saya akan **switch ke Code mode** untuk mengubah kode aplikasi
3. Kode akan diubah untuk menggunakan Supabase Auth dan Database
4. Testing dan deploy ke Netlify

---

## Catatan Penting

- **Jangan** menghapus atau mengubah `server/` directory sekarang (backup dulu)
- **Simpan** kredensial Supabase di tempat aman
- **Backup** data sebelum migrasi
- **Test** secara menyeluruh setelah perubahan kode

---

## Bantuan Tambahan

Jika mengalami masalah:
- Cek [Supabase Documentation](https://supabase.com/docs)
- Cek console browser untuk error messages
- Cek Supabase Dashboard → Logs untuk error di server side
