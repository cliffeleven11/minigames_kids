# 🚀 CARA MENJALANKAN APLIKASI - 3 LANGKAH MUDAH

## ⚡ Super Quick Start (2 Menit)

### Langkah 1: Buka Terminal
```powershell
# Windows PowerShell
cd c:\www\mini_games\mini-games-app
```

### Langkah 2: Install & Jalankan
```powershell
npm install
npm run dev
```

### Langkah 3: Buka Browser
```
http://localhost:3000
```

**✅ SELESAI! Game siap dimainkan!**

---

## 📝 Apa yang Terjadi di Setiap Langkah?

### npm install
- Download & install semua library yang dibutuhkan
- Membuat folder `node_modules/`
- Biasanya 1-2 menit (tergantung internet)

### npm run dev
- Jalankan server Express
- Server siap di port 3000
- Auto-reload jika ada perubahan file
- Lihat logs di terminal

### Browser
- Tampil home page dengan game list
- Input nama pemain
- Pilih game
- Main game
- Lihat score

---

## 🎮 Fitur Aplikasi

✅ 6 game edukatif untuk anak PAUD  
✅ Filter game berdasarkan usia  
✅ Sistem scoring otomatis  
✅ Leaderboard/papan peringkat  
✅ Responsive design (mobile/tablet friendly)  
✅ Sound effects & visual feedback  

---

## 🛑 Jika Ada Masalah

### Error: "npm: command not found"
```
→ Install Node.js dari https://nodejs.org/
→ Restart PowerShell
```

### Error: "Port 3000 already in use"
```
→ Buka .env file
→ Ubah PORT=3000 menjadi PORT=3001
→ Jalankan npm run dev lagi
```

### Error: "Cannot find module"
```
→ Jalankan: npm install
→ Tunggu sampai selesai
```

### Games tidak muncul
```
→ Buka F12 (Console)
→ Lihat error message
→ Refresh page (Ctrl+R)
```

---

## 📱 Akses dari Device Lain (Wi-Fi)

```powershell
# Di terminal, ketik:
ipconfig

# Cari: IPv4 Address (contoh: 192.168.1.100)

# Di phone/tablet, buka:
http://192.168.1.100:3000
```

---

## 🚀 Deploy ke Vercel (5 Menit)

```powershell
# 1. Install vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# Done! Dapat URL public
```

---

## 📂 Struktur File Penting

```
mini-games-app/
├── src/index.js          ← Server (Express)
├── public/index.html     ← Home page
├── public/assets/        ← CSS, JS, images
├── package.json          ← Dependencies
├── .env                  ← Konfigurasi
└── README.md             ← Dokumentasi lengkap
```

---

## 💻 Perintah Penting

```powershell
# Development mode (auto-reload)
npm run dev

# Production mode
npm start

# Install dependencies
npm install

# Update dependencies
npm update

# Stop server
Ctrl+C

# View Node version
node --version

# View npm version
npm --version
```

---

## ✨ Tips & Tricks

### Ubah Nama Tombol/Game
Edit: `src/games/config/gamesConfig.js`

### Ubah Warna Tema
Edit: `public/assets/css/style.css` baris 10-20

### Tambah Game Baru
Read: `QUICKSTART.md` bagian "Menambah Game Baru"

### Troubleshooting Lengkap
Read: `INSTALLATION.md`

---

## 📚 Dokumentasi Lanjutan

| File | Isi |
|------|-----|
| README.md | Dokumentasi lengkap & fitur |
| QUICKSTART.md | Guide cepat untuk dev |
| INSTALLATION.md | Step-by-step setup |
| ARCHITECTURE.md | Teknis & design patterns |
| API.md | API endpoints reference |

---

## 🎯 Development Workflow

```
1. Buat perubahan di file
2. Auto-reload (jika npm run dev)
3. Browser auto-refresh
4. Test di berbagai browser
5. Commit ke git
6. Deploy ke Vercel
```

---

## 🎓 Learning Path

### Pemula
1. Jalankan aplikasi
2. Mainkan semua game
3. Baca README.md
4. Coba ubah warna

### Menengah
1. Baca QUICKSTART.md
2. Tambah game baru
3. Customize tampilan
4. Deploy ke Vercel

### Advanced
1. Baca ARCHITECTURE.md
2. Add database (MongoDB)
3. Implement authentication
4. Create mobile app

---

## 📞 Bantuan Cepat

### Q: Bagaimana cara menambah game?
A: Lihat QUICKSTART.md bagian "Menambah Game Baru"

### Q: Bagaimana deploy ke Vercel?
A: Lihat INSTALLATION.md bagian "Deploy to Vercel"

### Q: Mengapa port 3000 error?
A: Ubah PORT di .env file

### Q: Bisakah berjalan di phone?
A: Ya, gunakan IP address WiFi (lihat atas)

### Q: Lebih detail tentang API?
A: Lihat API.md untuk semua endpoints

---

## ✅ Checklist Sebelum Deploy

- [ ] Semua game berfungsi
- [ ] Testing di mobile
- [ ] No console errors
- [ ] Sound effects work
- [ ] Scoring correct
- [ ] Update .env untuk production
- [ ] Push ke GitHub
- [ ] Deploy ke Vercel

---

## 🎉 Selesai!

Aplikasi sudah berjalan. Nikmati! 

Untuk pertanyaan lebih lanjut, baca dokumentasi lainnya.

---

**Version**: 1.0.0  
**Last Update**: January 2024
