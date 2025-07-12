import { useState } from "react";
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import { CameraModal } from "../../../components/modal/cameraModal";

export function PlantDiseaseDetection() {
  const [mode, setMode] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(false);

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

  const dataURLtoBlob = (dataURL) => {
    const [header, base64] = dataURL.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  };

  const submitPrediction = async () => {
    setLoading(true);
    setResult(null);
    try {
      const blob = dataURLtoBlob(preview);
      const formData = new FormData();
      formData.append("file", blob, "image.png");

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        alert("Gagal prediksi: " + data.error);
      }
    } catch (err) {
      alert("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f7fff4] py-10">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-lime-800 mb-2 text-center sm:text-left">
          Prediksi Penyakit Tanaman
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
                {loading ? "Memprediksi..." : "Submit untuk Prediksi"}
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

        {result && (
          <div className="rounded-xl border border-lime-200 bg-white p-6 shadow-sm mt-6">
            <h3 className="text-lime-800 font-semibold mb-1">Hasil Prediksi</h3>
            <p className="text-gray-700 text-sm mb-4">
              Daun terkena penyakit <strong>{result.class}</strong> dengan keyakinan <strong>{(result.confidence * 100).toFixed(2)}%</strong>.
            </p>
            {/* Rekomendasi bisa disesuaikan berdasarkan label */}
            <h4 className="text-lime-700 font-medium mb-1 text-sm">Rekomendasi:</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              <li>Pangkas bagian daun yang terinfeksi.</li>
              <li>Gunakan fungisida organik atau kimia sesuai anjuran.</li>
              <li>Jaga kelembaban dan sirkulasi udara.</li>
            </ul>
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
