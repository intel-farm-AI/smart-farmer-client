export function Describe() {
  return (
    <section className="py-20 bg-gradient-to-br from-lime-100 to-lime-50" id="about">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        {/* Gambar */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/src/assets/images/homepage/daun-segar.jpeg"
            alt="Ilustrasi Smart Farm"
            className="w-96 h-96 object-cover rounded-2xl shadow-lg border-4 border-lime-200 animate-fadeInUp"
          />
        </div>

        <div className="md:w-1/2">
          <h2 className="text-4xl font-extrabold text-lime-800 mb-6 leading-tight animate-fadeInUp">
            Mengenal <span className="text-lime-600">Smartfarm AI</span>
          </h2>

          <p className="text-base text-gray-700 mb-6 leading-relaxed animate-fadeInUp delay-100">
            <strong className="text-lime-700">Smartfarm AI</strong> adalah solusi digital berbasis kecerdasan buatan untuk membantu petani Indonesia mengoptimalkan hasil pertanian. Dirancang untuk menjawab tantangan di lapangan, aplikasi ini memberikan kemudahan, efisiensi, dan dukungan teknologi terbaru dalam satu platform.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeInUp delay-200">
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-lime-700 mb-2">Akses Mudah</h3>
              <p className="text-sm text-gray-600">Antarmuka sederhana yang dapat digunakan oleh semua petani, tanpa perlu keahlian teknis.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-lime-700 mb-2">Berbasis Data</h3>
              <p className="text-sm text-gray-600">Dibangun di atas riset dan data terkini untuk hasil yang lebih akurat dan terpercaya.</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-lime-700 mb-2">Selalu Berkembang</h3>
              <p className="text-sm text-gray-600">Kami terus mengembangkan fitur untuk mendukung pertanian yang berkelanjutan dan modern.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out both;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </section>
  );
}
