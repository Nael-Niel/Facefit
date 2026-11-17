# Project Specification: FaceFit - Web-Based Eyewear Recommendation & Virtual Try-On System

> **Instruksi untuk AI Agent (Cursor / Copilot / Cline / Windsurf):**
> Bangun aplikasi web lengkap berdasarkan spesifikasi di bawah ini. Proyek ini menggunakan pendekatan **Client-Side AI (Pre-trained MediaPipe Face Landmarker + Geometric Rule-Based Classification)** sehingga tidak memerlukan backend Python maupun proses training Machine Learning (Zero-Training, ringan, dan berjalan tanpa GPU).

---

## 1. Gambaran Umum Proyek (Project Overview)
**FaceFit** adalah aplikasi web sistem rekomendasi frame kacamata objektif berdasarkan bentuk wajah pengguna. Pengguna dapat mengunggah foto wajah atau menggunakan webcam, kemudian sistem akan:
1. Mendeteksi 478 titik koordinat wajah (*facial landmarks*) menggunakan `@mediapipe/tasks-vision` langsung di browser.
2. Menghitung rasio geometri wajah (Panjang Wajah, Lebar Dahi, Lebar Tulang Pipi, Lebar Rahang, dan Sudut Rahang).
3. Mengklasifikasikan bentuk wajah ke dalam 6 kategori (**Oval, Round, Square, Triangle, Heart, Diamond**) beserta skor keyakinan (*confidence score*).
4. Menampilkan rekomendasi frame kacamata sesuai matriks kecocokan.
5. Menyediakan fitur **Virtual Try-On** otomatis menggunakan HTML5 `<canvas>` yang menempelkan frame kacamata (SVG/PNG transparan) tepat di koordinat mata pengguna lengkap dengan *auto-scaling* dan *auto-rotation*.

---

## 2. Tech Stack & Library
- **Framework:** Next.js (App Router) dengan TypeScript (atau React + Vite).
- **Styling:** Tailwind CSS + Lucide React (untuk ikon).
- **Computer Vision / AI (Client-side):** `@mediapipe/tasks-vision` (`FaceLandmarker`).
- **Rendering Try-On:** HTML5 `<canvas>` API.
- **Tema Warna UI (Sesuai Brand Identity):**
  - Background utama: Warm Cream / Off-white (`#F8F6F2` dan `#EDF2F4`)
  - Aksen Primer: Earthy Brown / Terracotta (`#7C432B` dan `#4A2C1D`)
  - Aksen Sekunder: Olive Green (`#6B7F5E`)
  - Teks: Charcoal Dark (`#1E1E1E`)

---

## 3. Struktur Folder yang Harus Dibuat
```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Halaman utama (Landing + Analyzer + Try-On)
│   └── globals.css
├── components/
│   ├── Navbar.tsx               # Header navigasi bergaya fashion modern
│   ├── HeroSection.tsx          # Penjelasan singkat & matriks kecocokan
│   ├── FaceAnalyzer.tsx         # Komponen Upload Foto / Webcam & Canvas Try-On
│   ├── AnalysisResultCard.tsx   # Menampilkan Bentuk Wajah, Confidence, & Rasio Geometri
│   └── FrameRecommendation.tsx  # Katalog frame berdasarkan kecocokan + tombol Try-On
├── data/
│   └── eyewearData.ts           # Data matriks kecocokan & aset SVG frame kacamata
└── utils/
    ├── faceGeometry.ts          # Rumus jarak Euclidean, ekstraksi landmark, & klasifikasi
    └── canvasRenderer.ts        # Fungsi menggambar mesh wajah & overlay kacamata di Canvas
```

---

## 4. Logika AI & Perhitungan Geometri (`src/utils/faceGeometry.ts`)

Gunakan model pre-trained MediaPipe Face Landmarker dari CDN resmi:
`https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`

### A. Indeks Titik Landmark MediaPipe yang Digunakan:
- **Tinggi Wajah ($P$):** Jarak dari garis tengah dahi atas (Landmark `10`) ke ujung dagu bawah (Landmark `152`).
- **Lebar Dahi ($L_{dahi}$):** Jarak antara pelipis kiri (Landmark `103`) dan pelipis kanan (Landmark `332`).
- **Lebar Tulang Pipi ($L_{pipi}$):** Jarak antara tulang pipi terluar kiri (Landmark `234`) dan kanan (Landmark `454`).
- **Lebar Rahang ($L_{rahang}$):** Jarak antara sudut rahang kiri (Landmark `172`) dan sudut rahang kanan (Landmark `397`).
- **Koordinat Mata (untuk Virtual Try-On):**
  - Titik luar mata kiri (`33`), titik luar mata kanan (`263`), dan pangkal hidung / *nose bridge* (`168`).

### B. Rumus Jarak Euclidean:
$$d(A, B) = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$$

### C. Rasio Geometri & Aturan Klasifikasi (Heuristic Classifier):
Hitung rasio utama:
1. `lengthToWidthRatio` = $P / L_{pipi}$
2. `jawToCheekRatio` = $L_{rahang} / L_{pipi}$
3. `foreheadToCheekRatio` = $L_{dahi} / L_{pipi}$
4. `foreheadToJawRatio` = $L_{dahi} / L_{rahang}$

**Aturan Penentuan Bentuk Wajah:**
1. **Diamond Face:** Jika $L_{pipi}$ secara signifikan lebih lebar dari dahi dan rahang (`foreheadToCheekRatio < 0.82` dan `jawToCheekRatio < 0.80`).
2. **Heart Face:** Jika dahi lebar dan dagu menyempit tajam (`foreheadToJawRatio > 1.15` dan `jawToCheekRatio < 0.83`).
3. **Triangle Face:** Jika rahang lebih lebar dari dahi (`foreheadToJawRatio < 0.88` dan `jawToCheekRatio > 0.92`).
4. **Round Face:** Jika rasio panjang dan lebar hampir sama (`lengthToWidthRatio < 1.22`) dan rahang melengkung lembut (`jawToCheekRatio` antara `0.80` hingga `0.90`).
5. **Square Face:** Jika lebar dahi, pipi, dan rahang hampir sejajar (`jawToCheekRatio >= 0.90` dan `lengthToWidthRatio < 1.30`).
6. **Oval Face:** Proporsional dengan panjang wajah lebih dominan (`lengthToWidthRatio >= 1.25` dan `jawToCheekRatio < 0.90`).

*(Sediakan perhitungan skor persentase confidence antara 78% - 96% berdasarkan seberapa dekat nilai rasio pengguna dengan nilai ideal masing-masing kategori).*

---

## 5. Matriks Rekomendasi Kacamata (`src/data/eyewearData.ts`)

Implementasikan matriks kecocokan persis seperti tabel referensi penelitian:

| Bentuk Wajah | Cat-eye | Square | Aviator | Round | Oval |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Oval** | Very Suitable | Very Suitable | Very Suitable | Not Suitable | Very Suitable |
| **Round** | Very Suitable | Very Suitable | Suitable | Not Suitable | Moderately Suitable |
| **Square** | Suitable | Not Suitable | Moderately Suitable | Very Suitable | Suitable |
| **Triangle** | Very Suitable | Moderately Suitable | Suitable | Very Suitable | Very Suitable |
| **Heart** | Suitable | Moderately Suitable | Suitable | Very Suitable | Very Suitable |
| **Diamond** | Suitable | Suitable | Suitable | Very Suitable | Very Suitable |

**Katalog SVG Kacamata:**
Buat 5 komponen/data SVG vektor kacamata transparan yang rapi dan proporsional untuk:
1. `Cat-eye Frame`
2. `Square Frame`
3. `Aviator Frame`
4. `Round Frame`
5. `Oval Frame`

---

## 6. Spesifikasi Fitur Virtual Try-On (`src/utils/canvasRenderer.ts`)
Saat foto diunggah atau diambil dari webcam:
1. Gambar foto asli ke dalam `<canvas>`.
2. Sediakan tombol *toggle* **"Tampilkan Titik Geometri (Face Mesh)"** untuk menampilkan/menyembunyikan garis ukur dahi, pipi, rahang, dan panjang wajah di atas foto.
3. Saat pengguna mengklik salah satu kartu kacamata, gambar SVG/PNG kacamata tersebut di atas `<canvas>` dengan perhitungan:
   - **Posisi Tengah $(x, y)$:** Berdasarkan titik `168` (*nose bridge*).
   - **Lebar Kacamata:** $1.15 \times L_{pipi}$ (lebar tulang pipi dari titik `234` ke `454`).
   - **Rotasi Sudut ($\theta$):** $\text{atan2}(y_{263} - y_{33}, x_{263} - x_{33})$ agar kacamata otomatis miring mengikuti kemiringan kepala pengguna.
4. Sediakan tombol **"Download Hasil Try-On"** untuk mengunduh gambar dari `<canvas>` sebagai file PNG.

---

## 7. Alur Kerja Pengguna (User Flow di UI)
1. **State Awal:** Pengguna melihat instruksi foto (wajah menghadap depan, pencahayaan terang, tanpa kacamata). Terdapat tombol **"Unggah Foto"** (beserta 3 tombol *Sample Photo* bawaan untuk demo cepat) dan **"Gunakan Kamera"**.
2. **State Analisis:** Begitu foto masuk, MediaPipe mengekstrak landmark, menghitung rasio, dan menampilkan animasi *scanning* singkat.
3. **State Hasil:**
   - **Panel Kiri:** Canvas interaktif menampilkan foto pengguna dengan kacamata terpasang otomatis (default memilih frame pertama yang berstatus *Very Suitable*), kontrol *toggle* garis geometri, kontrol geser manual (*fine-tuning scale/offset Y*), dan tombol *Download*.
   - **Panel Kanan Atas:** Badge Bentuk Wajah, *Confidence Score* (%), serta tabel metrik rasio wajah ($P/L_{pipi}$, Lebar Dahi, Pipi, Rahang).
   - **Panel Kanan Bawah:** Daftar 5 jenis frame kacamata yang dilengkapi badge warna (*Very Suitable* = Hijau, *Suitable* = Biru, *Moderately Suitable* = Kuning, *Not Suitable* = Merah). Klik pada kartu langsung mengganti kacamata di wajah pengguna.

---

## 8. Instruksi Eksekusi untuk AI Agent
1. Inisialisasi proyek Next.js / React jika belum ada, lalu instal `@mediapipe/tasks-vision`, `lucide-react`, dan `tailwindcss`.
2. Buat seluruh file utilitas dan komponen sesuai struktur di atas tanpa ada placeholder kosong (*no TODOs, write full working code*).
3. Pastikan pembuatan aset SVG untuk kelima tipe frame kacamata terlihat realistis (memiliki lensa semi-transparan, bridge hidung, dan bingkai yang khas untuk Cat-eye, Square, Aviator, Round, dan Oval).
4. Tangani *error state* dengan baik (misalnya jika foto yang diunggah tidak terdapat wajah atau terdeteksi lebih dari satu wajah).