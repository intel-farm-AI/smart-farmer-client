// --- Paket Strategi untuk Komoditas Padi ---
export const strategiesPadi = [
  {
    name: "Paket Hemat Padi",
    cost: 1200000,
    yield: "5,5 ton/hA",
    profit: "Rp 25 juta",
  },
  {
    name: "Paket Optimal Padi",
    recommended: true,
    cost: 1500000,
    yield: "6,5 ton/hA",
    profit: "Rp 30 juta",
  },
  {
    name: "Paket Intensif Padi",
    cost: 2000000,
    yield: "7,5 ton/hA",
    profit: "Rp 35 juta",
  },
];

// --- Jadwal Operasional Padi (jika pilih Paket Optimal Padi) ---
export const schedulePadi = [
  { day: "Hari 0", task: "Pembajakan & Pengolahan Lahan", status: "Terjadwal" },
  { day: "Hari 7", task: "Penggenangan & Penggaruan", status: "Terjadwal" },
  { day: "Hari 15", task: "Persemaian Benih", status: "Terjadwal" },
  { day: "Hari 21", task: "Transplanting Bibit ke Lahan", status: "Terjadwal" },
  { day: "Hari 22", task: "Pemupukan Dasar (NPK, SP-36)", status: "Terjadwal" },
  { day: "Hari 30", task: "Pemupukan Susulan I (Urea, KCl)", status: "Terjadwal" },
  { day: "Hari 45", task: "Pemupukan Susulan II", status: "Terjadwal" },
  { day: "Hari 70", task: "Pemupukan Susulan III", status: "Terjadwal" },
  { day: "Hari 90", task: "Pengendalian Hama & Penyakit", status: "Terjadwal" },
  { day: "Hari 110", task: "Panen Gabah Kering Panen (GKP)", status: "Terjadwal" },
];

// --- Paket Strategi untuk Komoditas Jagung ---
export const strategiesJagung = [
  {
    name: "Paket Jagung Ekonomis",
    cost: 1000000,
    yield: "5,5 ton/hA",
    profit: "Rp 10 juta",
  },
  {
    name: "Paket Jagung Hibrida",
    recommended: true,
    cost: 1500000,
    yield: "8 ton/hA",
    profit: "Rp 15 juta",
  },
  {
    name: "Paket Jagung Intensif",
    cost: 2000000,
    yield: "10 ton/hA",
    profit: "Rp 20 juta",
  },
];

// --- Jadwal Operasional Jagung (jika pilih Paket Jagung Hibrida) ---
export const scheduleJagung = [
  { day: "Hari 0", task: "Pengolahan Tanah & Drainase", status: "Terjadwal" },
  { day: "Hari 1", task: "Penanaman Benih Jagung Hibrida", status: "Terjadwal" },
  { day: "Hari 7", task: "Pemupukan Dasar (Kandang, SP-36, KCl)", status: "Terjadwal" },
  { day: "Hari 10", task: "Penyulaman Tanaman", status: "Terjadwal" },
  { day: "Hari 20", task: "Penyiangan Gulma & Pembumbunan", status: "Terjadwal" },
  { day: "Hari 30", task: "Pemupukan Susulan I (Urea, NPK)", status: "Terjadwal" },
  { day: "Hari 45", task: "Pemupukan Susulan II", status: "Terjadwal" },
  { day: "Hari 60", task: "Pengairan Fase Generatif", status: "Terjadwal" },
  { day: "Hari 100", task: "Panen Jagung Pipilan Kering", status: "Terjadwal" },
];

// --- Paket Strategi untuk Komoditas Cabai ---
export const strategiesCabai = [
  {
    name: "Paket Cabai Minimalis",
    cost: 3000000,
    yield: "5 ton/hA",
    profit: "Rp 70 juta",
  },
  {
    name: "Paket Cabai Unggul",
    recommended: true,
    cost: 4000000,
    yield: "6,5 ton/hA",
    profit: "Rp 100 juta",
  },
  {
    name: "Paket Cabai Intensif",
    cost: 5000000,
    yield: "7,5 ton/hA",
    profit: "Rp 130 juta",
  },
];

// --- Jadwal Operasional Cabai (jika pilih Paket Cabai Unggul) ---
export const scheduleCabai = [
  { day: "Hari 0", task: "Persemaian Benih Cabai", status: "Terjadwal" },
  { day: "Hari 20", task: "Persiapan Bedengan & Mulsa Plastik", status: "Terjadwal" },
  { day: "Hari 30", task: "Transplanting Bibit ke Lahan", status: "Terjadwal" },
  { day: "Hari 35", task: "Pemasangan Ajir Bambu", status: "Terjadwal" },
  { day: "Hari 40", task: "Pemupukan Susulan Awal", status: "Terjadwal" },
  { day: "Hari 55", task: "Penyemprotan Pestisida Terjadwal", status: "Terjadwal" },
  { day: "Hari 70", task: "Pemupukan Susulan Lanjutan", status: "Terjadwal" },
  { day: "Hari 75", task: "Panen Pertama", status: "Terjadwal" },
  { day: "Hari 82", task: "Panen Kedua", status: "Terjadwal" },
  { day: "Hari 90", task: "Panen Ketiga", status: "Terjadwal" },
];
