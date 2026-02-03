# Panduan Deployment Aplikasi ADNT (Automated Due Notice Tool)

Aplikasi ini terdiri dari dua bagian utama:
1. **Client (Frontend)**: Dibangun dengan React + Vite.
2. **Server (Backend)**: Dibangun dengan Node.js + Express + SQLite + WhatsApp Web.js (Puppeteer).

Karena arsitektur ini (terutama penggunaan SQLite dan Puppeteer untuk WhatsApp), deployment memerlukan strategi khusus.

## ⚠️ Mengapa Tidak Bisa Full di Vercel?
Vercel sangat bagus untuk frontend (Client), tetapi **Server** tidak bisa berjalan sempurna di Vercel karena:
1. **SQLite**: Vercel menggunakan "Serverless Functions" yang bersifat *stateless*. File database (`database.sqlite`) akan ter-reset setiap kali server restart/deploy ulang. Data Anda akan hilang.
2. **WhatsApp Web.js (Puppeteer)**: Library ini menjalankan browser Chrome di background. Ini membutuhkan resource memory yang besar dan waktu eksekusi yang lama (long-running process) untuk menjaga koneksi WhatsApp tetap hidup. Serverless function memiliki batas waktu eksekusi (biasanya 10 detik) yang akan memutus koneksi WhatsApp.

---

## ✅ Strategi Deployment yang Disarankan

### Opsi 1: VPS (Virtual Private Server) - Paling Direkomendasikan
Gunakan VPS murah (seperti DigitalOcean Droplet, Linode, atau IDCloudHost) dengan OS Ubuntu. Ini memberi Anda kontrol penuh dan persistent storage.

**Langkah-langkah:**
1. Sewa VPS (Ubuntu 20.04/22.04).
2. Install Node.js, NPM, dan PM2.
3. Upload kode ke VPS (via Git atau SCP).
4. **Backend**:
   - Masuk ke folder `server`.
   - Jalankan `npm install`.
   - Install library pendukung Chrome: `sudo apt-get install -y libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 librandr2 libgbm1 libasound2`
   - Jalankan server dengan PM2: `pm2 start index.js --name adnt-server`.
5. **Frontend**:
   - Build aplikasi: masuk ke folder `client` dan jalankan `npm run build`.
   - Sajikan folder `dist` menggunakan Nginx.
6. Setup Nginx sebagai Reverse Proxy agar bisa diakses via domain (misal: `app.adnt.com`).

### Opsi 2: Hybrid (Frontend di Vercel, Backend di Railway/Render)
Jika tidak ingin mengurus server sendiri.

**Bagian 1: Backend (Railway/Render)**
*Catatan: Anda butuh layanan yang mendukung "Persistent Disk" (untuk SQLite) dan Docker (untuk Puppeteer).*
1. Push folder `server` ke GitHub.
2. Deploy ke **Railway** (pilih template Node.js).
3. **PENTING**: Tambahkan Volume/Disk untuk menyimpan `database.sqlite` agar data tidak hilang.
4. Set Environment Variable di Railway jika perlu.
5. Dapatkan URL Backend (misal: `https://adnt-server-production.up.railway.app`).

**Bagian 2: Frontend (Vercel)**
1. Push folder `client` ke GitHub.
2. Buka Vercel -> Add New Project -> Import Repository.
3. Di bagian **Environment Variables**, tambahkan:
   - Key: `VITE_API_URL`
   - Value: URL Backend Anda (contoh: `https://adnt-server-production.up.railway.app`)
   - **PENTING**: Jangan gunakan `http://localhost:3001` lagi.
4. Klik **Deploy**.

---

## 🚀 Cara Menjalankan Ulang di Lokal (Sekarang)

Saya telah mengupdate kode agar lebih fleksibel. Sekarang aplikasi membaca URL API dari file konfigurasi.

1. **Server** sedang berjalan di terminal.
2. **Client** sedang berjalan di terminal.
3. Akses aplikasi di browser lokal Anda (biasanya `http://localhost:5173`).
4. Jika ingin mengubah URL backend, edit file `client/.env`.

---

## 💡 Catatan Khusus WhatsApp
Setiap kali server restart (baik di VPS atau Railway), sesi WhatsApp mungkin terputus. Anda perlu masuk ke menu "WhatsApp Connect" di aplikasi dan scan QR Code ulang jika statusnya "Disconnected".
