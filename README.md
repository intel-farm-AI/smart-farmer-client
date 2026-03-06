<div align="center">

# 🌾 Smartfarm AI (Agrify)

## [Country Winner in Intel® AI Global Impact Festival 2025](https://www.intel.com/content/www/us/en/corporate/artificial-intelligence/winner2025.html#tab-blade-1-0)

### Sistem Cerdas Berbasis AI untuk Pertanian Modern Indonesia

[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![OpenVINO](https://img.shields.io/badge/OpenVINO-Inference-0068B5?logo=intel&logoColor=white)](https://docs.openvino.ai/)
[![License](https://img.shields.io/badge/License-Private-red)]()

</div>

---

## 📋 Daftar Isi

- [Ringkasan Proyek](#-ringkasan-proyek)
- [Latar Belakang & Permasalahan](#-latar-belakang--permasalahan)
- [Tujuan & Manfaat](#-tujuan--manfaat)
- [Arsitektur Sistem](#-arsitektur-sistem)
- [Tech Stack](#-tech-stack)
- [Fitur Utama](#-fitur-utama)
- [Model Machine Learning](#-model-machine-learning)
- [Alur Pengguna (User Flow)](#-alur-pengguna-user-flow)
- [Struktur Proyek](#-struktur-proyek)
- [API Reference](#-api-reference)
- [Integrasi & Layanan Pihak Ketiga](#-integrasi--layanan-pihak-ketiga)
- [Instalasi & Penggunaan](#-instalasi--penggunaan)
- [Environment Variables](#-environment-variables)
- [Tim Pengembang](#-tim-pengembang)
- [Roadmap & Pengembangan](#-roadmap--pengembangan)

---

## 🌟 Ringkasan Proyek

**Smartfarm AI (Agrify)** adalah platform web cerdas berbasis kecerdasan buatan (AI) yang dirancang khusus untuk membantu petani Indonesia dalam mengelola lahan pertanian secara lebih efisien, mendeteksi penyakit tanaman secara otomatis, serta menyediakan informasi cuaca dan harga pasar komoditas dalam satu ekosistem terpadu.

Sistem ini menggabungkan teknologi **Computer Vision** untuk deteksi penyakit tanaman melalui analisis citra, **forecasting cuaca real-time**, **manajemen lahan digital**, **penjadwalan tugas pertanian terstruktur**, serta **monitoring harga komoditas pasar** — semuanya diakses melalui antarmuka web modern yang responsif dan ramah pengguna.

---

## 🔍 Latar Belakang & Permasalahan

### Permasalahan yang Dihadapi

1. **Keterlambatan Identifikasi Penyakit Tanaman** — Petani seringkali kesulitan mengenali jenis penyakit yang menyerang tanaman secara dini, sehingga penanganan menjadi terlambat dan berujung pada kerugian hasil panen.

2. **Minimnya Akses Informasi Cuaca Lokal** — Petani tradisional masih menggunakan metode konvensional untuk memperkirakan cuaca, yang seringkali tidak akurat dan menyebabkan keputusan pertanian yang kurang tepat.

3. **Manajemen Lahan yang Tidak Terstruktur** — Pencatatan informasi lahan, jadwal perawatan, dan pengelolaan tugas harian masih dilakukan secara manual menggunakan catatan kertas yang rentan hilang.

4. **Kurangnya Transparansi Harga Pasar** — Petani tidak memiliki akses real-time terhadap fluktuasi harga komoditas, sehingga sulit menentukan waktu jual yang optimal.

5. **Kesenjangan Teknologi di Sektor Pertanian** — Teknologi AI dan machine learning belum banyak dimanfaatkan di sektor pertanian Indonesia, khususnya untuk petani kecil dan menengah.

### Solusi yang Ditawarkan

Smartfarm AI hadir sebagai solusi **all-in-one** yang mengintegrasikan:

- Deteksi penyakit otomatis berbasis AI melalui foto tanaman
- Prakiraan cuaca 7 hari berdasarkan lokasi pengguna
- Dashboard manajemen lahan pertanian digital
- Sistem penjadwalan tugas dengan strategi budidaya komoditas
- Informasi harga komoditas pasar terkini
- Sistem pelaporan dan komunikasi via email

---

## 🎯 Tujuan & Manfaat

### Tujuan

| No | Tujuan |
|----|--------|
| 1 | Mengembangkan sistem deteksi penyakit tanaman berbasis deep learning yang akurat dan cepat |
| 2 | Menyediakan platform manajemen pertanian digital terintegrasi untuk petani Indonesia |
| 3 | Mengimplementasikan prakiraan cuaca berbasis lokasi untuk mendukung pengambilan keputusan pertanian |
| 4 | Membangun sistem penjadwalan budidaya otomatis berdasarkan jenis komoditas dan modal |
| 5 | Menciptakan ekosistem informasi pertanian yang komprehensif dan mudah diakses |

### Manfaat

- **Bagi Petani**: Meningkatkan produktivitas melalui deteksi dini penyakit, perencanaan tanam yang lebih baik, dan akses informasi pasar
- **Bagi Penyuluh Pertanian**: Alat bantu diagnosis yang akurat untuk memberikan rekomendasi penanggulangan
- **Bagi Akademisi**: Referensi implementasi AI di sektor pertanian Indonesia
- **Bagi Pemerintah**: Data driven insights untuk kebijakan pertanian berbasis teknologi

---

## 🏗 Arsitektur Sistem

### Diagram Arsitektur

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                   React 19 + Vite 7                        │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │  Pages   │ │Components│ │ Context  │ │   Services   │  │  │
│  │  │          │ │          │ │          │ │              │  │  │
│  │  │• Home    │ │• Header  │ │• Auth    │ │• Firebase    │  │  │
│  │  │• Dashboard│ │• Sidebar │ │• Location│ │• Weather API │  │  │
│  │  │• Predict │ │• Modals  │ │          │ │• EmailJS     │  │  │
│  │  │• Market  │ │• Footer  │ │          │ │• Location    │  │  │
│  │  │• Tasks   │ │          │ │          │ │              │  │  │
│  │  │• Report  │ │          │ │          │ │              │  │  │
│  │  │• Auth    │ │          │ │          │ │              │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────┬───────┘  │  │
│  └────────────────────────────────────────────────┼───────────┘  │
└───────────────────────────────────────────────────┼──────────────┘
                                                    │
            ┌───────────────────────────────────────┼──────────┐
            │                                       │          │
            ▼                                       ▼          ▼
  ┌──────────────────┐              ┌─────────────────┐  ┌──────────┐
  │  FastAPI Backend  │              │    Firebase      │  │ External │
  │  (Python)         │              │    Platform      │  │  APIs    │
  │                   │              │                  │  │          │
  │ ┌───────────────┐ │              │ • Authentication │  │• Open    │
  │ │  OpenVINO     │ │              │ • Realtime DB    │  │  Meteo   │
  │ │  ML Engine    │ │              │ • Analytics      │  │• Nominatim│
  │ │               │ │              │                  │  │• Wilayah │
  │ │ Plant Disease │ │              │  Data Stores:    │  │  ID API  │
  │ │ Model v3.1    │ │              │ • users/         │  │• EmailJS │
  │ │ (48 classes)  │ │              │ • lands/         │  │          │
  │ │               │ │              │ • tasks/         │  │          │
  │ └───────────────┘ │              │ • landExpenses/  │  │          │
  │                   │              │                  │  │          │
  │ POST /predict     │              │                  │  │          │
  └──────────────────┘              └─────────────────┘  └──────────┘
```

### Pola Arsitektur

| Aspek | Detail |
|-------|--------|
| **Frontend Pattern** | Component-Based Architecture dengan React Context API untuk state management |
| **Backend Pattern** | RESTful API dengan FastAPI (Python) |
| **ML Inference** | OpenVINO Runtime untuk optimasi inferensi model pada CPU |
| **Database** | Firebase Realtime Database (NoSQL, real-time sync) |
| **Authentication** | Firebase Authentication (Email/Password + Google OAuth 2.0) |
| **Routing** | Client-side routing dengan React Router DOM v7 |
| **Data Fetching** | TanStack React Query untuk server state management & caching |
| **Styling** | Tailwind CSS v4 dengan glassmorphism design system |

---

## 💻 Tech Stack

### Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **React** | 19.1.0 | Library UI utama dengan functional components & hooks |
| **Vite** | 7.0.3 | Build tool & dev server dengan HMR (SWC-based) |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS framework |
| **React Router DOM** | 7.6.3 | Client-side routing & navigation |
| **TanStack React Query** | 5.83.0 | Async state management, caching, & data fetching |
| **Firebase SDK** | 11.10.0 | Authentication, Realtime Database, Analytics |
| **React Markdown** | 10.1.0 | Rendering hasil prediksi dalam format Markdown |
| **Day.js** | 1.11.13 | Manipulasi dan format tanggal (locale Indonesia) |
| **React Icons** | 5.5.0 | Library ikon (FI, FA, IO, HI, FC) |
| **EmailJS** | 4.4.1 | Pengiriman email langsung dari client |

### Backend

| Teknologi | Fungsi |
|-----------|--------|
| **FastAPI** | Framework Python untuk REST API |
| **Uvicorn** | ASGI server dengan hot-reload |
| **OpenVINO** | Intel AI inference engine untuk model ML |
| **Pillow (PIL)** | Pemrosesan gambar (resize, convert) |
| **NumPy** | Operasi array untuk preprocessing gambar |
| **python-multipart** | Parser multipart/form-data untuk upload file |

### Infrastruktur & Layanan

| Layanan | Fungsi |
|---------|--------|
| **Firebase Authentication** | Autentikasi pengguna (email/password + Google OAuth) |
| **Firebase Realtime Database** | Penyimpanan data user, lahan, tugas, dan pengeluaran |
| **Firebase Analytics** | Tracking penggunaan aplikasi |
| **Open-Meteo API** | Data prakiraan cuaca 7 hari (gratis, tanpa API key) |
| **Nominatim (OpenStreetMap)** | Geocoding & reverse geocoding lokasi |
| **API Wilayah Indonesia** | Data provinsi, kabupaten, kecamatan, kelurahan se-Indonesia |
| **EmailJS** | Layanan pengiriman email untuk fitur laporan/kontak |

---

## ✨ Fitur Utama

### 1. 🔬 Deteksi Penyakit Tanaman (AI-Powered)

Fitur unggulan yang memanfaatkan model deep learning untuk mengidentifikasi **48 jenis kondisi** pada **14 spesies tanaman** melalui analisis citra daun.

- **Input**: Foto tanaman melalui kamera langsung atau upload file
- **Proses**: Gambar di-resize ke 224×224 px, normalisasi, lalu diproses oleh model OpenVINO
- **Output**: Label penyakit, tingkat kepercayaan (%), deskripsi penyakit, dan rekomendasi obat
- **Rendering**: Hasil ditampilkan dalam format Markdown yang informatif

**Tanaman yang Didukung:**

| Tanaman | Jumlah Kelas | Penyakit yang Terdeteksi |
|---------|:------------:|--------------------------|
| Tomat | 10 | Bercak Bakteri, Hawar Daun Dini/Akhir, Jamur Daun, Septoria, Tungau, Bercak Target, Virus Keriting Kuning, Virus Mosaik, Sehat |
| Padi | 10 | Hawar Daun Bakteri, Garis Bakteri, Hawar Penicle, Blast, Bercak Coklat, Dead Heart, Embun Tepung, Wereng Batang, Tungro, Sehat |
| Jagung | 4 | Bercak Daun Cercospora, Karat Umum, Hawar Daun Utara, Sehat |
| Apel | 4 | Kudis Apel, Busuk Hitam, Karat Cedar, Sehat |
| Anggur | 4 | Busuk Hitam, Esca, Hawar Daun Isariopsis, Sehat |
| Kentang | 3 | Hawar Daun Dini, Hawar Daun Akhir, Sehat |
| Paprika | 2 | Bercak Bakteri, Sehat |
| Ceri | 2 | Embun Tepung, Sehat |
| Persik | 2 | Bercak Bakteri, Sehat |
| Stroberi | 2 | Daun Gosong, Sehat |
| Jeruk | 1 | Penyakit CVPD |
| Labu | 1 | Embun Tepung |
| Bluberi | 1 | Sehat |
| Raspberry | 1 | Sehat |
| Kedelai | 1 | Sehat |

### 2. 🌤 Prakiraan Cuaca 7 Hari

Menampilkan prakiraan cuaca berdasarkan lokasi pengguna dengan dua mode:

- **Mode Otomatis**: Deteksi lokasi via GPS browser + reverse geocoding untuk nama daerah
- **Mode Manual**: Seleksi bertingkat Provinsi → Kabupaten → Kecamatan → Kelurahan
- **Data**: Suhu max/min, kode cuaca (30+ kondisi), emoji visual
- **Peringatan Hujan**: Alert otomatis jika ramalan hari ini/besok menunjukkan hujan

### 3. 🌱 Manajemen Lahan Pertanian

Dashboard pengelolaan lahan digital yang terhubung dengan Firebase Realtime Database:

- **Tambah Lahan**: Nama, jenis tanaman (8 komoditas), lokasi (otomatis/manual), luas
- **Deteksi Lokasi**: Auto-detect via GPS atau pilih manual hingga tingkat kelurahan
- **Multi-step Form**: Wizard 2 langkah untuk pengisian data yang terstruktur
- **Real-time Sync**: Data tersinkronisasi secara real-time antar perangkat

### 4. 📋 Sistem Penjadwalan Tugas Pertanian

Manajemen tugas pertanian yang lengkap dengan dua mode pembuatan tugas:

- **Tugas Manual**: Input judul dan tanggal tugas secara langsung
- **Tugas AI-Generated**: Berdasarkan lahan terdaftar, jenis komoditas, fase tanam, dan modal
  - Mendukung komoditas: **Padi**, **Jagung**, **Cabai**
  - Strategi budidaya: Paket Hemat, Optimal, dan Intensif (masing-masing komoditas)
  - Jadwal operasional otomatis: 9-10 task dari awal tanam hingga panen
- **Kalender Visual**: Tampilan kalender bulanan untuk melihat distribusi tugas
- **Progress Tracking**: Toggle status selesai, hapus tugas, progress bar harian
- **Evaluasi Tugas**: Modal evaluasi dengan tracking pengeluaran per lahan dan estimasi profit

### 5. 📊 Informasi Harga Pasar Komoditas

Monitoring harga komoditas pertanian dengan fitur:

- **7 Komoditas**: Padi, Jagung, Kedelai, Singkong, Kentang, Cabai, Tomat
- **Data Tren**: Kenaikan/penurunan harga dengan indikator visual
- **Filter & Sort**: Pencarian, filter wilayah, sorting berdasarkan nama/harga/perubahan
- **Format IDR**: Harga dalam mata uang Rupiah Indonesia

### 6. 📩 Sistem Pelaporan & Kontak

Formulir kontak terintegrasi dengan EmailJS:

- Kirim laporan bug, saran, atau pertanyaan langsung ke tim pengembang
- Notifikasi keberhasilan/kegagalan pengiriman
- Template email otomatis dengan timestamp

### 7. 🔐 Autentikasi & Otorisasi

Sistem keamanan berlapis dengan Firebase Authentication:

- **Registrasi**: Email/password dengan penyimpanan profil ke Realtime Database
- **Login**: Email/password atau Google OAuth 2.0
- **Route Protection**: `RequireAuth` guard untuk halaman yang memerlukan login
- **Auto Redirect**: `RedirectIfAuth` untuk mengarahkan user yang sudah login

---

## 🤖 Model Machine Learning

### Spesifikasi Model

| Parameter | Detail |
|-----------|--------|
| **Nama Model** | Plant Disease Model v3.1 |
| **Format** | OpenVINO IR (XML + BIN) |
| **Input** | Gambar RGB 224×224 px, normalized (0-1), float32 |
| **Output** | Probabilitas 48 kelas penyakit tanaman |
| **Inference Engine** | Intel OpenVINO Runtime (CPU optimized) |
| **Dataset** | PlantVillage + dataset penyakit padi custom |

### Evolusi Model

| Versi | Format | Keterangan |
|-------|--------|------------|
| v2 | Keras (.keras) | Model awal dengan TensorFlow/Keras |
| v3 | OpenVINO IR (.xml) | Konversi ke OpenVINO untuk optimasi inferensi |
| **v3.1** | **OpenVINO IR (.xml)** | **Model aktif** — label Indonesia, dataset penyakit diperluas (termasuk padi) |

### Pipeline Inferensi

```
┌──────────┐     ┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Upload  │────▶│  Resize  │────▶│ Normalize │────▶│ OpenVINO │────▶│  Output  │
│  Image   │     │ 224×224  │     │  /255.0   │     │ Inference│     │  Result  │
│          │     │  RGB     │     │  float32  │     │   CPU    │     │          │
└──────────┘     └──────────┘     └───────────┘     └──────────┘     └──────────┘
                                                                         │
                                                         ┌───────────────┤
                                                         ▼               ▼
                                                   ┌──────────┐   ┌──────────┐
                                                   │  Label +  │   │ Disease  │
                                                   │Confidence │   │   Info   │
                                                   │    (%)    │   │  + Obat  │
                                                   └──────────┘   └──────────┘
```

---

## 🔄 Alur Pengguna (User Flow)

### Flow Utama

```
                              ┌──────────────┐
                              │   Landing    │
                              │    Page      │
                              │   (Home)     │
                              └──────┬───────┘
                                     │
                         ┌───────────┼───────────┐
                         ▼           ▼           ▼
                   ┌──────────┐ ┌─────────┐ ┌─────────┐
                   │  Login   │ │  About  │ │ Report  │
                   │          │ │  Team   │ │ Contact │
                   └────┬─────┘ └─────────┘ └─────────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
        ┌──────────┐          ┌─────────┐
        │ Register │          │ Google  │
        │ (Email)  │          │ OAuth   │
        └────┬─────┘          └────┬────┘
             └────────┬────────────┘
                      ▼
              ┌──────────────┐
              │  Dashboard   │
              │  (Main Hub)  │
              └──────┬───────┘
                     │
         ┌───────────┼───────────┬──────────────┐
         ▼           ▼           ▼              ▼
   ┌──────────┐ ┌─────────┐ ┌─────────┐  ┌──────────┐
   │  Cuaca   │ │  Lahan  │ │  Tugas  │  │ Sidebar  │
   │  7 Hari  │ │  Saya   │ │Hari Ini │  │   Nav    │
   └──────────┘ └────┬────┘ └────┬────┘  └────┬─────┘
                     │           │             │
                     ▼           ▼             │
               ┌──────────┐ ┌─────────┐       │
               │ Tambah   │ │ Tambah  │       │
               │  Lahan   │ │  Tugas  │       │
               └──────────┘ └─────────┘       │
                                              │
                   ┌──────────────────────────┤
                   ▼                          ▼
             ┌──────────┐            ┌──────────────┐
             │  Harga   │            │   Deteksi    │
             │  Pasar   │            │  Penyakit    │
             └──────────┘            └──────┬───────┘
                                            │
                                  ┌─────────┼─────────┐
                                  ▼                   ▼
                            ┌──────────┐        ┌──────────┐
                            │  Kamera  │        │  Upload  │
                            │ Langsung │        │  Galeri  │
                            └────┬─────┘        └────┬─────┘
                                 └────────┬──────────┘
                                          ▼
                                    ┌──────────┐
                                    │ Analisis │
                                    │    AI    │
                                    └────┬─────┘
                                         ▼
                                    ┌──────────┐
                                    │  Hasil   │
                                    │ Diagnosis│
                                    │ + Obat   │
                                    └──────────┘
```

### Detail Alur per Fitur

#### 1. Alur Deteksi Penyakit
1. User navigasi ke halaman "Cek Penyakit" via sidebar
2. Pilih metode input: **Kamera Langsung** atau **Upload Gambar**
3. Preview gambar ditampilkan
4. Klik "Mulai Analisis AI" → gambar dikirim ke backend sebagai `multipart/form-data`
5. Backend memproses: resize → normalize → OpenVINO inference
6. Hasil dikembalikan: label, confidence, deskripsi, rekomendasi obat
7. Ditampilkan dalam format Markdown dengan skeleton loading animation

#### 2. Alur Manajemen Lahan
1. User membuka Dashboard → section "Lahan Milik Anda"
2. Klik "Tambah Lahan" → modal multi-step terbuka
3. **Step 1**: Pilih jenis tanaman (8 opsi), nama lahan, mode lokasi, luas
4. **Step 2**: Konfirmasi & submit
5. Data tersimpan ke Firebase (`lands/{uid}/{landId}`)
6. Real-time listener memperbarui tampilan

#### 3. Alur Penjadwalan Tugas
1. User membuka Dashboard → section "Tugas Hari Ini"
2. **Mode Manual**: Isi judul + tanggal → simpan
3. **Mode AI**: Pilih lahan → komoditas → fase → modal → generate strategi
4. Pilih paket strategi (Hemat/Optimal/Intensif)
5. AI generate jadwal operasional (9-10 tasks) berdasarkan komoditas
6. Simpan jadwal ke Firebase → otomatis masuk kalender
7. Kalender tugas menampilkan semua tugas dalam tampilan bulanan

---

## 📁 Struktur Proyek

```
smart-farmer-client/
│
├── 📄 index.html                    # Entry point HTML
├── 📄 package.json                  # Dependencies & scripts
├── 📄 vite.config.js                # Vite + TailwindCSS + SWC config
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 firebase.js                   # Firebase config (legacy/reference)
│
├── 📂 public/                       # Static assets
│
├── 📂 src/                          # Frontend source code
│   ├── 📄 main.jsx                  # React entry point (BrowserRouter, QueryClient)
│   ├── 📄 App.jsx                   # Root component (Routes definition)
│   ├── 📄 App.css                   # Global styles
│   ├── 📄 index.css                 # Tailwind imports
│   │
│   ├── 📂 assets/images/            # Gambar statis
│   │   ├── homepage/                # Gambar landing page & auth
│   │   ├── logo/                    # Logo & favicon
│   │   └── profile/                 # Foto tim pengembang
│   │
│   ├── 📂 context/                  # React Context Providers
│   │   ├── authContext.jsx          # AuthProvider, RequireAuth, RedirectIfAuth
│   │   └── locationContext.jsx      # LocationProvider (GPS + permission handling)
│   │
│   ├── 📂 layout/
│   │   └── main.jsx                 # MainLayout (Header, Sidebar, Footer, responsive)
│   │
│   ├── 📂 components/               # Reusable UI components
│   │   ├── navbar/
│   │   │   ├── header.jsx           # Navbar dengan auth state, avatar, dropdown
│   │   │   └── sidebar.jsx          # Sidebar navigasi (Dashboard, Pasar, Prediksi)
│   │   ├── footer/
│   │   │   └── footer.jsx           # Footer component
│   │   └── modal/
│   │       ├── AddLandModal.jsx     # Multi-step form tambah lahan (731 lines)
│   │       ├── taskFormModal.jsx    # Form tugas manual + AI-generated (644 lines)
│   │       ├── taskEvaluationModal.jsx # Evaluasi & tracking pengeluaran tugas
│   │       ├── cameraModal.jsx      # Akses kamera perangkat untuk capture gambar
│   │       └── aboutModal.jsx       # Floating about button
│   │
│   ├── 📂 pages/                    # Halaman aplikasi
│   │   ├── index.jsx                # Home/Landing page
│   │   ├── chatwithai.jsx           # Dashboard utama (Weather + Land + Task)
│   │   ├── prediction.jsx           # Halaman deteksi penyakit
│   │   ├── market.jsx               # Halaman harga komoditas pasar
│   │   ├── listAllTasks.jsx         # Kalender tugas bulanan (431 lines)
│   │   ├── about.jsx                # Halaman profil tim
│   │   ├── report.jsx               # Halaman kontak/laporan
│   │   │
│   │   ├── auth/
│   │   │   ├── login.jsx            # Login (email + Google OAuth)
│   │   │   └── register.jsx         # Registrasi user baru
│   │   │
│   │   └── section/
│   │       ├── main/                # Sections halaman landing
│   │       │   ├── banner.jsx       # Hero section dengan parallax
│   │       │   ├── feature.jsx      # 3 fitur unggulan
│   │       │   ├── describe.jsx     # Deskripsi platform
│   │       │   ├── howItWorks.jsx   # 3 langkah cara kerja
│   │       │   ├── join.jsx         # CTA bergabung
│   │       │   └── testimoni.jsx    # Section testimoni
│   │       │
│   │       └── chat/                # Sections dashboard
│   │           ├── weather.jsx      # Widget cuaca 7 hari (397 lines)
│   │           ├── agriculturalLand.jsx # Manajemen lahan
│   │           ├── task.jsx         # Tugas harian dengan progress bar
│   │           └── detection.jsx    # UI deteksi penyakit (312 lines)
│   │
│   └── 📂 lib/                      # Libraries & utilities
│       ├── weatherCode.js           # Mapping 30 kode cuaca WMO → emoji + label Indonesia
│       ├── data/
│       │   └── strategies.js        # Data strategi budidaya (Padi, Jagung, Cabai)
│       ├── services/
│       │   ├── firebase.js          # Firebase init (Auth, DB, Analytics, Google Provider)
│       │   ├── getWeatherForecast.js # Open-Meteo API integration
│       │   └── emailjs.js           # EmailJS service wrapper
│       └── utils/
│           ├── googleAuth.js        # Google OAuth login + save to DB
│           ├── location.js          # Geocoding, reverse geocoding, wilayah Indonesia API
│           ├── developerTeam.js     # Data anggota tim pengembang
│           └── dataURLtoBlobs.js    # Konversi dataURL ke Blob untuk upload
│
└── 📂 smart-farmer-backend/         # Backend ML API
    ├── 📄 main.py                   # FastAPI app, endpoint /predict
    ├── 📄 requirements.txt          # Python dependencies
    ├── 📄 Readme.md                 # Dokumentasi backend
    ├── 📄 Plant_Disease_Detection.ipynb # Jupyter notebook training
    │
    └── 📂 models/                   # ML model files
        ├── model-v2/                # Legacy Keras model
        │   ├── plant_disease_model_v2.keras
        │   ├── disease_dataset.json
        │   └── labels.json
        ├── model-v3/                # OpenVINO model v3
        │   ├── plant_disease_model_L4.keras
        │   ├── plant-disease-model-v3.xml
        │   ├── disease_label.json
        │   └── labels_id.json
        └── model-v3.1/              # ✅ Model aktif
            ├── plant-disease-v3.1.xml    # Model OpenVINO IR
            ├── labels.json               # 48 label kelas (Indonesia)
            └── disease_label.json        # Deskripsi + rekomendasi obat
```

---

## 📡 API Reference

### Backend API (FastAPI)

#### `POST /predict`

Endpoint utama untuk deteksi penyakit tanaman.

**Request:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | `UploadFile` | ✅ | File gambar tanaman (JPG/PNG) |

**Content-Type:** `multipart/form-data`

**Response:**

```json
{
  "label": "Tomat - Hawar Daun Dini",
  "confidence": 96.45,
  "deskripsi": "Hawar daun dini menyebabkan bercak konsentris cokelat pada daun tua...",
  "obat_rekomendasi": [
    "Mankozeb",
    "Klorotalonil",
    "Azoksistrobin"
  ]
}
```

**Error Response:**

```json
{
  "detail": "Error message description"
}
```

### External APIs

| API | Endpoint | Metode | Kegunaan |
|-----|----------|--------|----------|
| Open-Meteo | `api.open-meteo.com/v1/forecast` | GET | Prakiraan cuaca 7 hari |
| Nominatim | `nominatim.openstreetmap.org/search` | GET | Geocoding (nama → koordinat) |
| Nominatim | `nominatim.openstreetmap.org/reverse` | GET | Reverse geocoding (koordinat → nama) |
| Wilayah ID | `emsifa.com/api-wilayah-indonesia/api/` | GET | Data administratif Indonesia |

---

## 🔗 Integrasi & Layanan Pihak Ketiga

### Firebase (Google Cloud)

| Layanan | Kegunaan | Data Path |
|---------|----------|-----------|
| **Authentication** | Login/register email + Google | — |
| **Realtime Database** | Penyimpanan data aplikasi | `users/{uid}`, `lands/{uid}`, `tasks/{uid}`, `landExpenses/{uid}` |
| **Analytics** | Tracking metrik penggunaan | — |

**Struktur Database Firebase:**

```
root/
├── users/
│   └── {uid}/
│       ├── name: string
│       ├── email: string
│       └── createdAt: timestamp
│
├── lands/
│   └── {uid}/
│       └── {landId}/
│           ├── name: string
│           ├── crop: string
│           ├── location: string
│           └── size: string
│
├── tasks/
│   └── {uid}/
│       └── {taskId}/
│           ├── title: string
│           ├── date: string (YYYY-MM-DD)
│           ├── done: boolean
│           ├── strategy?: string
│           ├── landId?: string
│           └── commodity?: string
│
└── landExpenses/
    └── {uid}/
        └── {landId}/
            └── {expenseId}/
                └── amount: number
```

### Open-Meteo Weather API

- **Gratis & open-source** — tanpa API key
- Parameter: `latitude`, `longitude`, `daily` (temperature, weathercode), `timezone=auto`
- Response di-mapping dengan 30 kode cuaca WMO ke emoji dan label Bahasa Indonesia

### Nominatim (OpenStreetMap)

- Geocoding dengan fallback 3 level untuk keakuratan
- Reverse geocoding untuk tampilan nama lokasi dari GPS
- Cache di `localStorage` untuk mengurangi request

### API Wilayah Indonesia

- Endpoint bertingkat: Provinsi → Kabupaten → Kecamatan → Kelurahan
- Seluruh data wilayah administratif Indonesia tercakup

---

## 🚀 Instalasi & Penggunaan

### Prasyarat

| Software | Versi Minimum |
|----------|:-------------:|
| Node.js | 18.x |
| npm / yarn | 9.x / 1.x |
| Python | 3.9+ |
| pip | Latest |

### 1. Clone Repository

```bash
git clone <repository-url>
cd smart-farmer-client
```

### 2. Setup Frontend

```bash
# Install dependencies
npm install

# Buat file .env (lihat section Environment Variables)
cp .env.example .env

# Jalankan development server
npm run dev
```

### 3. Setup Backend

```bash
cd smart-farmer-backend

# Buat virtual environment
python -m venv venv
source venv/bin/activate    # Linux/Mac
# venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Jalankan backend server
python main.py
# atau
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Build untuk Production

```bash
# Frontend
npm run build
npm run preview   # Preview build result

# Backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🔑 Environment Variables

Buat file `.env` di root proyek frontend:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Backend API
VITE_API_PREDICTION_URL=http://127.0.0.1:8000/predict

# EmailJS Configuration
VITE_PUBLIC_KEY_EMAILJS=your_emailjs_public_key
VITE_SERVICE_ID_EMAILJS=your_emailjs_service_id
VITE_TEMPLATE_ID_EMAILJS=your_emailjs_template_id
```

---

## 👥 Tim Pengembang

<div align="center">

| Nama | Role | LinkedIn | GitHub |
|------|------|----------|--------|
| **Habibi Ahmad Aziz** | Web Developer | [LinkedIn](https://www.linkedin.com/in/habibi-ahmad-aziz-0b3618283/) | [GitHub](https://github.com/habibiahmada) |
| **Muhammad Sultan Nurulloh T.** | ML Engineer | [LinkedIn](https://www.linkedin.com/in/muhammadsultannurulloh/) | [GitHub](https://github.com/budisantoso) |
| **Muhammad Salman Al Farisi** | ML Engineer | [LinkedIn](https://www.linkedin.com/in/muhammad-salman-al-farisi-14a517324/) | [GitHub](https://github.com/avlfarizi) |

</div>

---

## 🗺 Roadmap & Pengembangan

### ✅ Fitur yang Sudah Diimplementasi

- [x] Autentikasi (Email/Password + Google OAuth)
- [x] Deteksi penyakit tanaman 48 kelas dengan OpenVINO
- [x] Prakiraan cuaca 7 hari berbasis lokasi
- [x] Manajemen lahan pertanian digital
- [x] Penjadwalan tugas manual dan AI-generated
- [x] Strategi budidaya 3 komoditas (Padi, Jagung, Cabai)
- [x] Kalender tugas visual bulanan
- [x] Informasi harga pasar komoditas
- [x] Sistem pelaporan via email
- [x] Responsive design (mobile & desktop)
- [x] Glassmorphism UI design system

### 🔮 Rencana Pengembangan Selanjutnya

- [ ] Integrasi data harga pasar real-time dari API pemerintah
- [ ] Penambahan komoditas strategi budidaya (Kedelai, Singkong, Kentang, dll.)
- [ ] Fitur chat/diskusi komunitas petani
- [ ] Notifikasi push untuk peringatan cuaca & jadwal tugas
- [ ] Multi-language support (Indonesia, English)
- [ ] Offline mode dengan service worker (PWA)
- [ ] Export laporan pertanian ke PDF
- [ ] Integrasi IoT sensor untuk monitoring lahan real-time
- [ ] Fitur marketplace jual beli hasil panen antar petani
- [ ] Deployment model ML ke edge device (smartphone)

---

<div align="center">

**Smartfarm AI** — Teknologi untuk Pertanian Indonesia yang Lebih Cerdas 🌾

*Dikembangkan dengan ❤️ oleh Tim Agrify*

</div>
