import { useEffect, useRef, useState } from "react";

export function CameraModal({ onClose, onUseImage }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [captured, setCaptured] = useState(null);

  // Start kamera saat modal dibuka
  useEffect(() => {
    let currentStream;

    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Kamera tidak tersedia:", err);
        alert("Tidak dapat mengakses kamera.");
        onClose();
      }
    }

    startCamera();

    return () => {
      // Hentikan semua track saat komponen dibersihkan
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onClose]);

  // Update stream ke video element saat berubah
    useEffect(() => {
    if (videoRef.current && stream && !captured) {
        videoRef.current.srcObject = stream;
    }
    }, [captured, stream]);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Resize agar tidak terlalu besar
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL("image/png");
    setCaptured(dataUrl);
  };

  const handleUseImage = () => {
    if (captured) {
      onUseImage(captured);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"></div>
      <div className="relative z-10 w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-10 animate-popupIn relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none"
            aria-label="Tutup"
          >
            &times;
          </button>

          <h2 className="text-lg font-semibold text-lime-800 mb-4 text-center">Ambil Gambar dari Kamera</h2>

          <div className="aspect-video w-full min-h-[350px] bg-gray-100 flex items-center justify-center rounded-xl mb-8 border border-lime-100 overflow-hidden">
            {!captured ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <img
                src={captured}
                alt="Snapshot"
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {!captured ? (
              <button
                onClick={handleCapture}
                className="px-4 py-2 rounded text-sm font-medium bg-lime-100 hover:bg-lime-200 text-lime-700 border border-lime-200 transition"
              >
                Ambil Gambar
              </button>
            ) : (
              <>
                <button
                  onClick={handleUseImage}
                  className="px-4 py-2 rounded text-sm font-medium bg-lime-600 hover:bg-lime-700 text-white shadow transition"
                >
                  Gunakan Gambar Ini
                </button>
                <button
                  onClick={() => setCaptured(null)}
                  className="px-4 py-2 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition"
                >
                  Ulangi
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
        @keyframes popupIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .animate-popupIn { animation: popupIn 0.35s cubic-bezier(.4,1.4,.6,1) forwards; }
      `}</style>
    </div>
  );
}
