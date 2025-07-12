export function Describe() {
  return (
    <section className="py-16 bg-lime-100" id="about">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <img src="/src/assets/images/homepage/daun-segar.jpeg" alt="Tentang Smart Farmer" className="w-64 mx-auto" />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-lime-800 mb-4">Tentang Smart Farmer</h2>
            <p className="text-lg text-gray-700 mb-4">
              Smart Farmer adalah aplikasi berbasis AI yang membantu petani Indonesia meningkatkan produktivitas dan efisiensi pertanian. Dengan teknologi mutakhir, kami hadir untuk mendukung pertanian berkelanjutan dan modern.
            </p>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Mudah digunakan oleh semua kalangan petani</li>
              <li>Didukung oleh data dan riset terbaru</li>
              <li>Gratis dan selalu berkembang</li>
            </ul>
          </div>
        </div>
    </section>
  );
}