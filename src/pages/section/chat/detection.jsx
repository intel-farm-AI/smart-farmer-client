import { useState, useEffect } from "react";
import { FaCamera, FaCloudUploadAlt, FaLeaf, FaRobot, FaCheckCircle } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { CameraModal } from "../../../components/modal/cameraModal";
import ReactMarkdown from "react-markdown";

export function PlantDiseaseDetection() {
  const [_, setMode] = useState(null); 
  const [preview, setPreview] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [showFade, setShowFade] = useState(false);
  const apiUrl = import.meta.env.VITE_API_PREDICTION_URL;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCamera = () => {
    setMode("camera");
    setShowCameraModal(true);
  };

  const handleCloseCamera = () => {
    setShowCameraModal(false);
    setMode(null);
  };

  const resetUpload = () => {
    setPreview(null);
    setMode(null);
    setResult(null);
  };

  function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
    return new Blob([u8arr], { type: mime });
  }

  const submitPrediction = async () => {
    setLoading(true);
    setResult(null);
    setShowFade(false);
    try {
      // Ubah preview (dataURL) menjadi Blob
      const blob = dataURLtoBlob(preview);
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      // Tampilkan hasil prediksi secara markdown
      setResult(
        data.label
          ? `**${data.label}**\n\n**Confidence score:** ${data.confidence}%\n\n**Deskripsi:** ${data.deskripsi}\n\n**Rekomendasi Obat:**\n${Array.isArray(data.obat_rekomendasi) && data.obat_rekomendasi.length > 0 ? data.obat_rekomendasi.map((o) => `- ${o}`).join("\n") : "Tidak ada rekomendasi."}`
          : "Tidak ada respons dari AI."
      );
    } catch {
      setResult("Terjadi kesalahan saat memproses prediksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && result) {
      // Delay agar fade-in smooth setelah skeleton hilang
      const timeout = setTimeout(() => setShowFade(true), 50);
      return () => clearTimeout(timeout);
    } else {
      setShowFade(false);
    }
  }, [loading, result]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-25 p-6">
      <div className="container mx-auto">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

          {/* Upload Section */}
          <div className="min-h-[300px] mb-12">
            <h2 className="text-4xl pb-2 sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent text-center lg:text-left">Deteksi Penyakit Tanaman</h2>
            <p className="text-slate-300 mb-8 text-center lg:text-left">Gunakan AI untuk mendiagnosis penyakit tanaman dari gambar</p>
            {!preview ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Camera Button */}
                <button
                  onClick={handleOpenCamera}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 backdrop-blur-xl p-8 shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-105 hover:border-emerald-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <FaCamera className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center animate-bounce">
                        <IoSparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Kamera Langsung</h3>
                    <p className="text-slate-300 leading-relaxed">Ambil gambar tanaman secara langsung dengan kamera perangkat Anda</p>
                    <div className="mt-4 px-4 py-2 bg-emerald-900/30 border border-emerald-700/50 rounded-full">
                      <span className="text-emerald-300 text-sm font-medium">Analisis Real-time</span>
                    </div>
                  </div>
                </button>

                {/* Upload Button */}
                <label
                  htmlFor="upload-input"
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 backdrop-blur-xl p-8 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:scale-105 hover:border-cyan-500/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                        <FaCloudUploadAlt className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center animate-pulse">
                        <IoSparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Unggah Gambar</h3>
                    <p className="text-slate-300 leading-relaxed">Pilih gambar tanaman dari galeri perangkat Anda</p>
                    <div className="mt-4 px-4 py-2 bg-cyan-900/30 border border-cyan-700/50 rounded-full">
                      <span className="text-cyan-300 text-sm font-medium">Proses Banyak Gambar</span>
                    </div>
                  </div>
                  <input
                    id="upload-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleImageChange(e);
                      setMode("upload");
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative group mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <img
                    src={preview}
                    alt="Pratinjau Gambar Tanaman"
                    className="relative max-w-lg w-full h-80 object-cover rounded-3xl border-4 border-slate-700/50 shadow-2xl group-hover:shadow-emerald-500/20 transition-all duration-500"
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={submitPrediction}
                    disabled={loading}
                    className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-center space-x-3 relative z-10">
                      <FaRobot className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                      <span>{loading ? "Menganalisis..." : "Mulai Analisis AI"}</span>
                      {!loading && <IoSparkles className="w-4 h-4 animate-pulse" />}
                    </div>
                  </button>
                  <button
                    onClick={resetUpload}
                    className="text-red-400 hover:text-red-300 px-8 py-4 rounded-2xl font-bold border-2 border-red-500/30 hover:border-red-400/50 hover:bg-red-900/20 transition-all duration-300 backdrop-blur-sm"
                  >
                    Hapus Gambar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="min-h-[300px]">
            {(preview && (loading || result)) && (
              <div className="rounded-3xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-xl shadow-2xl h-full overflow-hidden">
                {/* Header hasil */}
                <div className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <FaRobot className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Hasil Analisis AI</h3>
                        <p className="text-emerald-100 text-sm">Diagnosis Machine Learning Lanjutan</p>
                      </div>
                    </div>
                    {result && !loading && (
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                        <FaCheckCircle className="w-5 h-5 text-green-300" />
                        <span className="font-bold">Selesai</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content area */}
                <div className="p-8">
                  {loading ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-6 h-6 bg-emerald-400 rounded-full animate-bounce"></div>
                        <div className="h-8 bg-slate-700/50 rounded-xl w-1/3 animate-pulse"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 bg-slate-700/30 rounded-xl w-3/4 animate-pulse"></div>
                        <div className="h-6 bg-slate-700/30 rounded-xl w-2/4 animate-pulse delay-100"></div>
                        <div className="h-6 bg-slate-700/30 rounded-xl w-5/6 animate-pulse delay-200"></div>
                        <div className="h-6 bg-slate-700/30 rounded-xl w-1/2 animate-pulse delay-300"></div>
                      </div>
                      <div className="mt-8 space-y-3">
                        <div className="h-6 bg-slate-700/30 rounded-xl w-1/3 animate-pulse delay-400"></div>
                        <div className="h-4 bg-slate-700/20 rounded-lg w-2/3 animate-pulse delay-500"></div>
                        <div className="h-4 bg-slate-700/20 rounded-lg w-1/2 animate-pulse delay-600"></div>
                        <div className="h-4 bg-slate-700/20 rounded-lg w-3/4 animate-pulse delay-700"></div>
                      </div>
                    </div>
                  ) : result ? (
                    <div className={`transition-all duration-1000 transform ${showFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                      <ReactMarkdown
                        components={{
                          h1: (props) => <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent mt-8 mb-6 border-b-2 border-emerald-700/50 pb-4" {...props} />,
                          h2: (props) => <h2 className="text-3xl font-bold text-emerald-200 mt-6 mb-4" {...props} />,
                          h3: (props) => <h3 className="text-2xl font-semibold text-emerald-300 mt-5 mb-3" {...props} />,
                          ul: (props) => <ul className="list-none space-y-3 ml-0" {...props} />,
                          ol: (props) => <ol className="list-decimal list-inside space-y-3 ml-6" {...props} />,
                          li: (props) => (
                            <li className="flex items-start space-x-4 p-4 bg-slate-700/30 rounded-2xl border border-slate-600/30 backdrop-blur-sm hover:bg-slate-700/40 transition-colors duration-300" {...props}>
                              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                              <span className="flex-1 text-slate-200">{props.children}</span>
                            </li>
                          ),
                          p: (props) => <p className="mb-6 leading-relaxed text-slate-300 text-lg" {...props} />,
                          strong: (props) => <strong className="font-bold bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent text-xl" {...props} />,
                          code: (props) => <code className="bg-slate-700/50 text-emerald-300 px-3 py-2 rounded-lg text-sm font-mono border border-slate-600/30" {...props} />,
                          pre: (props) => <pre className="bg-slate-900/50 p-6 rounded-2xl mb-6 overflow-x-auto border border-slate-700/50 backdrop-blur-sm" {...props} />,
                          a: (props) => <a className="text-cyan-400 hover:text-cyan-300 underline font-bold transition-colors duration-200" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                      >
                        {result}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-40 text-slate-400">
                      <div className="text-center">
                        <FaLeaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-xl">Hasil analisis akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Placeholder ketika belum ada preview */}
            {!preview && (
              <div className="rounded-3xl border-2 border-dashed border-slate-600/50 bg-slate-700/20 backdrop-blur-sm h-full flex items-center justify-center">
                <div className="text-center text-slate-300">
                  <div className="relative inline-block mb-6">
                    <FaLeaf className="w-16 h-16 mx-auto opacity-60" />
                    <div className="absolute -top-2 -right-2">
                      <IoSparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Siap untuk Analisis AI</h3>
                  <p className="text-slate-400 text-lg">Unggah gambar tanaman untuk memulai diagnosis cerdas</p>
                </div>
              </div>
            )}
          </div>
      </div>

      {showCameraModal && (
        <CameraModal
          onClose={handleCloseCamera}
          onUseImage={(image) => {
            setPreview(image);
            setShowCameraModal(false);
            setMode("camera");
          }}
        />
      )}
    </section>
  );
}