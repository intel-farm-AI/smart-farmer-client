import { useState, useEffect } from "react";
import { FaCamera, FaCloudUploadAlt, FaLeaf, FaRobot, FaCheckCircle } from "react-icons/fa";
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
          ? `**${data.label}**\n\n**Akurasi:** ${data.confidence}%\n\n**Deskripsi:** ${data.deskripsi}\n\n**Rekomendasi Obat:**\n${Array.isArray(data.obat_rekomendasi) && data.obat_rekomendasi.length > 0 ? data.obat_rekomendasi.map((o) => `- ${o}`).join("\n") : "Tidak ada rekomendasi."}`
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
    <section className="min-h-screen">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-green-100">
        {/* Header Section dengan animasi */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <FaLeaf className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-3">
            Deteksi Penyakit Pada Tanaman Anda
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Analisis kesehatan tanaman Anda dengan teknologi AI terdepan. Upload gambar atau gunakan kamera untuk diagnosis instant.
          </p>
        </div>

        {/* Upload Section dengan tinggi tetap */}
        <div className="min-h-[200px] mb-8">
          {!preview ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <button
                onClick={handleOpenCamera}
                className="group relative overflow-hidden rounded-2xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-green-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaCamera className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Gunakan Kamera</h3>
                  <p className="text-sm text-gray-600">Ambil foto langsung dari perangkat Anda</p>
                </div>
              </button>

              <label
                htmlFor="upload-input"
                className="group relative overflow-hidden cursor-pointer rounded-2xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50 p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:border-green-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <FaCloudUploadAlt className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Upload Gambar</h3>
                  <p className="text-sm text-gray-600">Pilih gambar daun dari galeri Anda</p>
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
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview Daun"
                  className="max-w-sm w-full h-64 object-cover rounded-2xl border-4 border-green-200 shadow-xl group-hover:shadow-2xl transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={submitPrediction}
                  disabled={loading}
                  className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <div className="flex items-center space-x-2">
                    <FaRobot className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? "Menganalisis..." : "Analisis dengan AI"}</span>
                  </div>
                </button>
                <button
                  onClick={resetUpload}
                  className="text-red-500 hover:text-red-700 px-6 py-3 rounded-xl font-medium border border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                >
                  Hapus Gambar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Section dengan tinggi tetap */}
        <div className="min-h-[200px]">
          {(preview && (loading || result)) && (
            <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-white to-green-50/30 shadow-xl backdrop-blur-sm h-full">
              {/* Header hasil */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FaRobot className="w-4 h-4" />
                  </div>
                  <h3 className="text-xl font-semibold">Hasil Analisis AI</h3>
                  {result && !loading && (
                    <div className="ml-auto flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                      <FaCheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Selesai</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content area */}
              <div className="p-6 h-full">
                {loading ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-300 rounded-full animate-bounce"></div>
                      <div className="h-6 bg-green-200 rounded-lg w-1/3"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-green-100 rounded w-3/4"></div>
                      <div className="h-4 bg-green-100 rounded w-2/4"></div>
                      <div className="h-4 bg-green-100 rounded w-5/6"></div>
                      <div className="h-4 bg-green-100 rounded w-1/2"></div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-4 bg-green-100 rounded w-1/3"></div>
                      <div className="h-3 bg-green-100 rounded w-2/3"></div>
                      <div className="h-3 bg-green-100 rounded w-1/2"></div>
                      <div className="h-3 bg-green-100 rounded w-3/4"></div>
                    </div>
                  </div>
                ) : result ? (
                  <div className={`transition-all duration-700 transform ${showFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <ReactMarkdown
                      components={{
                        h1: (props) => <h1 className="text-3xl font-bold text-green-800 mt-6 mb-4 border-b-2 border-green-200 pb-2" {...props} />,
                        h2: (props) => <h2 className="text-2xl font-bold text-green-700 mt-5 mb-3" {...props} />,
                        h3: (props) => <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2" {...props} />,
                        ul: (props) => <ul className="list-none space-y-2 ml-0" {...props} />,
                        ol: (props) => <ol className="list-decimal list-inside space-y-2 ml-4" {...props} />,
                        li: (props) => (
                          <li className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400" {...props}>
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="flex-1">{props.children}</span>
                          </li>
                        ),
                        p: (props) => <p className="mb-4 leading-relaxed text-gray-700" {...props} />,
                        strong: (props) => <strong className="font-bold text-green-800 text-lg" {...props} />,
                        code: (props) => <code className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono" {...props} />,
                        pre: (props) => <pre className="bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto border" {...props} />,
                        a: (props) => <a className="text-blue-600 hover:text-blue-800 underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                      }}
                    >
                      {result}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <div className="text-center">
                      <FaLeaf className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Hasil analisis akan muncul di sini</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Placeholder ketika belum ada preview */}
          {!preview && (
            <div className="rounded-2xl border-2 border-dashed border-green-300 bg-green-50/50 h-full flex items-center justify-center">
              <div className="text-center text-green-600">
                <FaLeaf className="w-12 h-12 mx-auto mb-4 opacity-60" />
                <h3 className="text-xl font-semibold mb-2">Siap untuk Analisis</h3>
                <p className="text-gray-600">Upload gambar daun untuk memulai diagnosis AI</p>
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