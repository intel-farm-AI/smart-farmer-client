export function Testimoni(){
    return (
        <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Apa Kata Petani?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-gray-700 italic mb-4">“Sejak pakai Smartfarm AI, hasil panen saya meningkat dan tanaman lebih sehat!”</p>
              <span className="font-semibold text-green-700">Budi, Petani Cabai</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-gray-700 italic mb-4">“Aplikasi ini sangat membantu, terutama fitur deteksi penyakitnya yang akurat.”</p>
              <span className="font-semibold text-green-700">Siti, Petani Tomat</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <p className="text-gray-700 italic mb-4">“Rekomendasi perawatan dari AI sangat mudah dipahami dan diterapkan.”</p>
              <span className="font-semibold text-green-700">Agus, Petani Padi</span>
            </div>
          </div>
        </div>
    </section>
    )
}