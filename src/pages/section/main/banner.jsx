import { Link } from "react-router-dom";

export function Banner() {
  return (
    <section className="bg-gradient-to-br from-green-100 to-green-300 py-10 md:py-40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 px-4">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 leading-tight mb-6">
              <span className="text-green-600">Smartfarm AI</span><br />Solusi Cerdas untuk Pertanian Modern
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Optimalkan hasil panen, deteksi penyakit tanaman, dan dapatkan rekomendasi terbaik dengan teknologi AI.
            </p>
            <Link to="/login">
              <button className="bg-green-800 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-green-700 transition-all">
                Mulai Sekarang
              </button>
            </Link>
          </div>
          <div className="flex justify-center">
            <img src="/src/assets/images/homepage/homepage.jpg" alt="Smart Farm Hero" className="rounded-2xl shadow-2xl w-xl md:w-full max-w-md" />
          </div>
        </div>
    </section>
  );
}