import { useState, useContext, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherForecast } from "../../../lib/services/getWeatherForecast";
import { LocationContext } from "../../../context/locationContext";
import { getAuth } from "firebase/auth";

export function Weather() {
  const { location, locationChecked } = useContext(LocationContext);
  const auth = getAuth();
  const user = auth.currentUser;

  const [mode, setMode] = useState("otomatis");
  const [provinsi, setProvinsi] = useState("");
  const [kota, setKota] = useState("");

  const lokasiManualData = useMemo(() => ({
    JawaBarat: {
      Bandung: { lat: -6.9147, lon: 107.6098 },
      Karawang: { lat: -6.3059, lon: 107.3095 },
    },
    JawaTengah: {
      Semarang: { lat: -7.0051, lon: 110.4381 },
      Solo: { lat: -7.5653, lon: 110.816 },
    },
  }), []);

  // State for reverse geocoded name
  const [autoLocationName, setAutoLocationName] = useState("");
  const [loadingAutoLocation, setLoadingAutoLocation] = useState(false);
  const [errorAutoLocation, setErrorAutoLocation] = useState("");

  // Reverse geocode function with localStorage cache
  const reverseGeocode = async (lat, lon) => {
    const cacheKey = `reverseGeocode_${lat}_${lon}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      return cached;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=id`
      );
      const data = await response.json();
      let result = "Lokasi tidak diketahui";
      if (data && data.address) {
        const address = data.address;
        // Gabungkan nama daerah secara lengkap
        const parts = [];
        if (address.village) parts.push(address.village);
        if (address.hamlet && !parts.includes(address.hamlet)) parts.push(address.hamlet);
        if (address.suburb && !parts.includes(address.suburb)) parts.push(address.suburb);
        if (address.town && !parts.includes(address.town)) parts.push(address.town);
        if (address.city_district && !parts.includes(address.city_district)) parts.push(address.city_district);
        if (address.county && !parts.includes(address.county)) parts.push(address.county);
        if (address.city && !parts.includes(address.city)) parts.push(address.city);
        if (address.state_district && !parts.includes(address.state_district)) parts.push(address.state_district);
        if (address.state && !parts.includes(address.state)) parts.push(address.state);
        if (address.country && !parts.includes(address.country)) parts.push(address.country);
        if (parts.length > 0) {
          result = parts.join(", ");
        }
      }
      localStorage.setItem(cacheKey, result);
      return result;
    } catch {
      return "Lokasi tidak diketahui";
    }
  };

  // Effect for auto mode: fetch area name when lat/lon changes
  useEffect(() => {
    if (mode === "otomatis" && location.lat && location.lon) {
      setLoadingAutoLocation(true);
      setErrorAutoLocation("");
      reverseGeocode(location.lat, location.lon)
        .then((name) => {
          setAutoLocationName(name);
          setLoadingAutoLocation(false);
        })
        .catch(() => {
          setAutoLocationName("");
          setErrorAutoLocation("Gagal memuat nama lokasi.");
          setLoadingAutoLocation(false);
        });
    } else {
      setAutoLocationName("");
      setLoadingAutoLocation(false);
      setErrorAutoLocation("");
    }
  }, [mode, location.lat, location.lon]);

  // Compose lokasiDipakai for query
  const lokasiDipakai = useMemo(() => {
    if (mode === "otomatis") {
      return { lat: location.lat, lon: location.lon, label: autoLocationName || location.label || "" };
    }
    const selected = lokasiManualData?.[provinsi]?.[kota];
    return selected
      ? { ...selected, label: `${kota}, ${provinsi}` }
      : { lat: null, lon: null, label: "" };
  }, [mode, location, provinsi, kota, autoLocationName, lokasiManualData]);

  const {
    data: forecast = [],
    isLoading: loadingWeather,
    isError,
  } = useQuery({
    queryKey: ['weatherForecast', mode, lokasiDipakai.lat, lokasiDipakai.lon],
    queryFn: () => getWeatherForecast(lokasiDipakai.lat, lokasiDipakai.lon),
    enabled: !!lokasiDipakai.lat && !!lokasiDipakai.lon,
    staleTime: 1000 * 60 * 10,
  });

  const errorWeather = isError ? "Gagal memuat data cuaca." : null;

  // Cek apakah hari ini atau besok hujan
  let rainWarning = null;
  if (forecast && forecast.length > 0) {
    // Cek hari ini
    const todayRain = /hujan/i.test(forecast[0]?.kondisi || "");
    // Cek besok
    const besokRain = forecast[1] && /hujan/i.test(forecast[1]?.kondisi || "");
    if (todayRain) {
      rainWarning = {
        label: "PERINGATAN HARI INI",
        message: "WASPADA HUJAN!",
        detail: "Diperkirakan hujan di waktu sore. Lindungi alat dan tunda penyemprotan.",
      };
    } else if (besokRain) {
      rainWarning = {
        label: "PERINGATAN BESOK",
        message: "WASPADA HUJAN!",
        detail: "Diperkirakan hujan di waktu sore. Lindungi alat dan tunda penyemprotan.",
      };
    }
  }

  return (
    <section className="bg-lime-50 py-10">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <div>
            <h2 className="text-3xl font-bold text-lime-800 text-center sm:text-left mb-1 sm:mb-0">
              Selamat Datang{user && user.displayName ? ` ${user.displayName}` : ''}!
            </h2>
            <div className="text-gray-500 text-center sm:text-left">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          {rainWarning && (
            <div className="flex flex-col items-end sm:items-end">
              <div className="flex items-center gap-2 bg-yellow-100 border-l-4 border-yellow-500 px-4 py-3 rounded shadow-sm animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold text-yellow-700 uppercase text-xs tracking-wider">{rainWarning.label}</div>
                  <div className="font-bold text-yellow-800 text-lg">{rainWarning.message}</div>
                  <div className="text-yellow-700 text-sm mt-1">{rainWarning.detail}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-5 text-center sm:text-left">
          Berikut prakiraan cuaca untuk 7 hari ke depan
        </p>
        <hr className="border border-gray-100 mb-6" />

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <label className="font-medium text-gray-700">Mode Lokasi:</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="otomatis">Lokasi saat ini</option>
            <option value="manual">Pilih Manual</option>
          </select>

          {mode === "manual" && (
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={provinsi}
                onChange={(e) => {
                  setProvinsi(e.target.value);
                  setKota(""); // reset kota saat provinsi berubah
                }}
                className="border rounded px-3 py-2"
              >
                <option value="">Pilih Provinsi</option>
                {Object.keys(lokasiManualData).map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>

              <select
                value={kota}
                onChange={(e) => setKota(e.target.value)}
                className="border rounded px-3 py-2"
                disabled={!provinsi}
              >
                <option value="">Pilih Kota/Kabupaten</option>
                {provinsi && Object.keys(lokasiManualData[provinsi]).map((kota) => (
                  <option key={kota} value={kota}>{kota}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="w-full md:w-1/3 px-4 md:px-0 md:pr-8 md:border-r md:border-lime-200">
            <div className="mb-3">
              <span className="text-base font-medium text-gray-700">Lokasi:</span>{" "}
              {mode === "otomatis" ? (
                !navigator.onLine ? (
                  <span className="text-gray-400 font-semibold ml-2">Tidak ada koneksi internet</span>
                ) : loadingAutoLocation ? (
                  <span className="text-lime-800 font-semibold animate-pulse ml-2">Memuat lokasi…</span>
                ) : errorAutoLocation ? (
                  <span className="text-red-500 font-semibold ml-2">{errorAutoLocation}</span>
                ) : !lokasiDipakai.label || lokasiDipakai.label === "Lokasi tidak diketahui" ? (
                  <span className="text-gray-400 font-semibold ml-2">Lokasi belum terdeteksi</span>
                ) : (
                  <span className="text-lime-800 font-semibold ml-2">{lokasiDipakai.label}</span>
                )
              ) : (
                !provinsi || !kota ? (
                  <span className="text-gray-400 font-semibold ml-2">Pilih lokasi manual</span>
                ) : (
                  <span className="text-lime-800 font-semibold ml-2">{lokasiDipakai.label}</span>
                )
              )}
            </div>
            <div className="min-h-[140px]">
              {loadingWeather && (
                <div className="flex flex-col animate-pulse">
                  <div className="w-16 h-16 bg-lime-100 rounded-full mb-2" />
                  <div className="w-24 h-7 bg-lime-100 rounded mb-2" />
                  <div className="w-20 h-5 bg-lime-100 rounded mb-2" />
                </div>
              )}
              {errorWeather && <span className="text-red-500 text-sm">{errorWeather}</span>}
              {!loadingWeather && !errorWeather && forecast.length > 0 && (
                <>
                  <span className="text-5xl">{forecast[0].icon}</span>
                  <div className="text-3xl font-bold text-lime-700">{forecast[0].suhu}</div>
                  <div className="text-gray-600 text-md mb-2">{forecast[0].kondisi}</div>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:flex-1">
            <h3 className="text-xl font-semibold text-lime-700 mb-4 text-center md:text-left">
              Prakiraan 7 Hari ke Depan
            </h3>

            <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto md:overflow-visible pb-2">
              {loadingWeather ? (
                Array.from({ length: 7 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-lime-100 rounded-xl px-4 py-3 min-w-[110px] md:min-w-0 shadow-sm animate-pulse"
                  >
                    <div className="w-16 h-4 bg-lime-200 rounded mb-2" />
                    <div className="w-8 h-8 bg-lime-200 rounded-full mb-2" />
                    <div className="w-16 h-4 bg-lime-200 rounded mb-2" />
                    <div className="w-20 h-3 bg-lime-200 rounded" />
                  </div>
                ))
              ) : (
                forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-lime-100 rounded-xl px-4 py-3 min-w-[110px] md:min-w-0 shadow-sm hover:scale-105 transition-all"
                  >
                    <span className="font-semibold text-gray-700 mb-1">{day.hari}</span>
                    <span className="text-2xl mb-1">{day.icon}</span>
                    <span className="font-bold text-lime-700 text-sm">{day.suhu}</span>
                    <span className="text-gray-500 text-xs text-center">{day.kondisi}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}