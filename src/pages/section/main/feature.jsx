export function Feature() {
  return (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-lime-800 mb-10">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-lime-50 p-8 rounded-xl shadow hover:scale-105 transition-transform">
              <img src="/src/assets/images/logo/smart-farm.svg" alt="Deteksi Penyakit" className="w-16 h-16 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-lime-700 mb-2 text-center">Deteksi Penyakit Otomatis</h3>
              <p className="text-gray-600 text-center">Unggah foto tanaman, AI akan mendeteksi penyakit dan memberikan solusi penanganan.</p>
            </div>
            <div className="bg-lime-50 p-8 rounded-xl shadow hover:scale-105 transition-transform">
              <img src="/src/assets/images/logo/web-app-manifest-192x192.png" alt="Rekomendasi" className="w-16 h-16 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-lime-700 mb-2 text-center">Rekomendasi Perawatan</h3>
              <p className="text-gray-600 text-center">Dapatkan tips perawatan, pemupukan, dan penyiraman yang sesuai dengan kondisi tanaman Anda.</p>
            </div>
            <div className="bg-lime-50 p-8 rounded-xl shadow hover:scale-105 transition-transform">
              <img src="/src/assets/images/logo/web-app-manifest-512x512.png" alt="Analisis Data" className="w-16 h-16 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-lime-700 mb-2 text-center">Analisis Data Pertanian</h3>
              <p className="text-gray-600 text-center">Pantau perkembangan tanaman dan hasil panen dengan dashboard analitik interaktif.</p>
            </div>
          </div>
        </div>
    </section>
  );
}