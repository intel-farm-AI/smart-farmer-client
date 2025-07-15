import { useState, useRef, useEffect } from "react";
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import { CameraModal } from "../../../components/modal/cameraModal";
// import { predictPlantDiseaseWithGroq } from "../../../lib/services/groqPredict";
import ReactMarkdown from "react-markdown";

export function PlantDiseaseDetection() {
  const [_, setMode] = useState(null); 
  const [preview, setPreview] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [showFade, setShowFade] = useState(false);

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

  // Helper: Convert dataURL to Blob
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

      const response = await fetch("http://localhost:8000/predict", {
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
    <section className="bg-[#f7fff4] py-10">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-lime-800 mb-2 text-center sm:text-left">
          Cek Penyakit Tanaman
        </h2>
        <p className="mb-6 text-gray-600">Cek kesehatan tanamanmu dengan AI kami</p>

        {!preview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={handleOpenCamera}
              className="rounded-xl border border-lime-200 bg-white p-6 shadow-sm flex flex-col items-center text-center hover:bg-lime-50 transition"
            >
              <FaCamera className="w-10 h-10 text-lime-600 mb-3" />
              <p className="text-sm text-lime-700 font-medium">Gunakan Kamera</p>
            </button>
            <label
              htmlFor="upload-input"
              className="cursor-pointer rounded-xl border border-lime-200 bg-white p-6 shadow-sm flex flex-col items-center text-center hover:bg-lime-50 transition"
            >
              <FaCloudUploadAlt className="w-10 h-10 text-lime-600 mb-3" />
              <p className="text-sm text-lime-700 font-medium">Upload Gambar Daun</p>
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
        )}

        {preview && (
          <div className="mb-6 flex flex-col items-center">
            <img
              src={preview}
              alt="Preview Daun"
              className="w-1/2 object-cover rounded-xl border mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={submitPrediction}
                className="bg-lime-600 hover:bg-lime-700 text-white px-6 py-2 rounded transition"
                disabled={loading}
              >
                {loading ? "Memprediksi..." : "Kirim Gambar"}
              </button>
              <button
                onClick={resetUpload}
                className="text-sm text-red-500 hover:underline"
              >
                Hapus Gambar
              </button>
            </div>
          </div>
        )}

        {(loading || result) && (
          <div className="rounded-xl border border-lime-200 bg-white p-6 shadow-sm mt-6 min-h-[100px]">
            <h3 className="text-lime-800 font-semibold mb-1">Hasil Prediksi AI</h3>
            <div className="prose prose-sm max-w-none text-gray-700 min-h-[60px]">
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-lime-100 rounded w-3/4"></div>
                  <div className="h-4 bg-lime-100 rounded w-2/4"></div>
                  <div className="h-4 bg-lime-100 rounded w-1/2"></div>
                  <div className="h-4 bg-lime-100 rounded w-1/3"></div>
                </div>
              ) : (
                <div className={`transition-opacity duration-700 ${showFade ? 'opacity-100' : 'opacity-0'}`}>
                  <ReactMarkdown
                    components={{
                      h1: (props) => <h1 className="text-2xl font-bold text-lime-800 mt-4 mb-2" {...props} />,
                      h2: (props) => <h2 className="text-xl font-bold text-lime-700 mt-4 mb-2" {...props} />,
                      h3: (props) => <h3 className="text-lg font-semibold text-lime-700 mt-3 mb-1" {...props} />,
                      ul: (props) => <ul className="list-disc list-inside space-y-1" {...props} />,
                      ol: (props) => <ol className="list-decimal list-inside space-y-1" {...props} />,
                      li: (props) => <li className="ml-4" {...props} />,
                      p: (props) => <p className="mb-2" {...props} />,
                      code: (props) => <code className="bg-gray-100 px-1 rounded text-xs" {...props} />,
                      pre: (props) => <pre className="bg-gray-100 p-2 rounded mb-2 overflow-x-auto" {...props} />,
                      a: (props) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      table: (props) => <table className="table-auto border-collapse my-2" {...props} />,
                      th: (props) => <th className="border px-2 py-1 bg-gray-100" {...props} />,
                      td: (props) => <td className="border px-2 py-1" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
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
