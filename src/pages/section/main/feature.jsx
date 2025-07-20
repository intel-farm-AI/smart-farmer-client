import { FaStethoscope, FaLeaf, FaCloudSun } from "react-icons/fa";

export function Feature() {
  return (
    <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 p-8 rounded-xl shadow hover:scale-105 transition-transform">
              <FaStethoscope className="w-16 h-16 mb-4 mx-auto text-green-700" />
              <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">Deteksi Penyakit Otomatis</h3>
              <p className="text-gray-600 text-center">Unggah foto tanaman, AI akan mendeteksi penyakit dan memberikan solusi penanganan.</p>
            </div>
            <div className="bg-green-50 p-8 rounded-xl shadow hover:scale-105 transition-transform">
              <FaLeaf className="w-16 h-16 mb-4 mx-auto text-green-700" />
              <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">Rekomendasi Perawatan</h3>
              <p className="text-gray-600 text-center">Dapatkan tips perawatan, pemupukan, dan penyiraman yang sesuai dengan kondisi tanaman Anda.</p>
            </div>
            <div className="bg-green-50 p-8 rounded-xl shadow hover:scale-105 transition-transform">
              <FaCloudSun className="w-16 h-16 mb-4 mx-auto text-green-700" />
              <h3 className="text-xl font-semibold text-green-700 mb-2 text-center">Perkiraan Cuaca</h3>
              <p className="text-gray-600 text-center">Pantau prakiraan cuaca terkini untuk mendukung aktivitas pertanian Anda.</p>
            </div>
          </div>
        </div>
    </section>
  );
}