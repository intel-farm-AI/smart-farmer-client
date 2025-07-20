export function Howitworks(){
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Cara Kerja <span className="text-green-600">Smartfarm AI</span></h2>
            <div className="flex flex-col md:flex-row justify-center gap-8">
                <div className="flex flex-col items-center">
                <div className="bg-green-200 rounded-full w-20 h-20 flex items-center justify-center mb-4 text-2xl font-bold text-green-800">1</div>
                <p className="text-center text-gray-700">Unggah foto tanaman yang ingin dianalisis</p>
                </div>
                <div className="flex flex-col items-center">
                <div className="bg-green-200 rounded-full w-20 h-20 flex items-center justify-center mb-4 text-2xl font-bold text-green-800">2</div>
                <p className="text-center text-gray-700">AI menganalisis dan mendeteksi penyakit atau masalah</p>
                </div>
                <div className="flex flex-col items-center">
                <div className="bg-green-200 rounded-full w-20 h-20 flex items-center justify-center mb-4 text-2xl font-bold text-green-800">3</div>
                <p className="text-center text-gray-700">Dapatkan rekomendasi perawatan dan solusi terbaik</p>
                </div>
            </div>
            </div>
        </section>
    )
}