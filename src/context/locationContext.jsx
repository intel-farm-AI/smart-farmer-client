import { createContext, useEffect, useState } from "react";

export const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [location, setLocation] = useState({ lat: null, lon: null, label: "Mendeteksi lokasi..." });
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);

  useEffect(() => {
    async function detectPermission() {
      if (!navigator.geolocation) {
        setLocation({ lat: null, lon: null, label: "Geolocation tidak didukung." });
        setLocationChecked(true);
        return;
      }

      try {
        const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

        if (permissionStatus.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setLocation({
                lat: latitude,
                lon: longitude,
                label: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
              });
              setLocationChecked(true);
            },
            () => {
              setLocation({ lat: null, lon: null, label: "Tidak dapat mendeteksi lokasi." });
              setLocationChecked(true);
            }
          );
        } else if (permissionStatus.state === "prompt") {
          setShowLocationPopup(true);
          setLocationChecked(true);
        } else {
          setLocation({ lat: null, lon: null, label: "Izin lokasi ditolak." });
          setLocationChecked(true);
        }
      } catch (e) {
        setShowLocationPopup(true);
        setLocationChecked(true);
      }
    }

    detectPermission();
  }, []);

  const handleAllowLocation = () => {
    setShowLocationPopup(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({
          lat: latitude,
          lon: longitude,
          label: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
        });
      },
      () => {
        setLocation({ lat: null, lon: null, label: "Izin lokasi ditolak." });
      }
    );
  };

  const handleDenyLocation = () => {
    setShowLocationPopup(false);
    setLocation({ lat: null, lon: null, label: "Izin lokasi ditolak." });
  };

  return (
    <LocationContext.Provider value={{ location, locationChecked }}>
      {children}

      {showLocationPopup && (
        <div className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center pointer-events-none">
          <div className="relative z-10 bg-white rounded-t-2xl shadow-2xl p-6 w-full max-w-md mx-auto mb-4 animate-popupIn pointer-events-auto">
            <h2 className="text-lg font-bold text-green-800 mb-2 text-center">Izinkan Akses Lokasi</h2>
            <p className="text-gray-700 mb-4 text-center text-sm">
              Agar dapat menampilkan prakiraan cuaca sesuai lokasi Anda, aplikasi membutuhkan izin akses lokasi.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAllowLocation}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold shadow"
              >
                Izinkan
              </button>
              <button
                onClick={handleDenyLocation}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded font-semibold border border-gray-200"
              >
                Tolak
              </button>
            </div>
            <style>{`
              @keyframes popupIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
              .animate-popupIn { animation: popupIn 0.35s cubic-bezier(.4,1.4,.6,1) forwards; }
            `}</style>
          </div>
        </div>
      )}
    </LocationContext.Provider>
  );
}