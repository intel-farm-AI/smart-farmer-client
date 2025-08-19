import { useState, useContext, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherForecast } from "../../../lib/services/getWeatherForecast";
import { LocationContext } from "../../../context/locationContext";
import { getAuth } from "firebase/auth";
import {
  fetchProvinsi,
  fetchKabupaten,
  fetchKecamatan,
  fetchKelurahan,
  getLocationCoordinates,
  reverseGeocode
} from "../../../lib/utils/location";

export function Weather() {
  const { location, locationChecked } = useContext(LocationContext);
  const auth = getAuth();
  const user = auth.currentUser;

  const [mode, setMode] = useState("otomatis");
  const [provinsi, setProvinsi] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kelurahan, setKelurahan] = useState("");

  // States untuk data location API
  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [loadingProvinsi, setLoadingProvinsi] = useState(false);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingKelurahan, setLoadingKelurahan] = useState(false);

  // State for reverse geocoded name
  const [autoLocationName, setAutoLocationName] = useState("");
  const [loadingAutoLocation, setLoadingAutoLocation] = useState(false);
  const [errorAutoLocation, setErrorAutoLocation] = useState("");

  // Load provinsi saat component mount
  useEffect(() => {
    setLoadingProvinsi(true);
    fetchProvinsi()
      .then((data) => setProvinsiList(data))
      .catch((error) => console.error('Error fetching provinsi:', error))
      .finally(() => setLoadingProvinsi(false));
  }, []);

  // Load kabupaten saat provinsi berubah
  useEffect(() => {
    if (provinsi) {
      setLoadingKabupaten(true);
      fetchKabupaten(provinsi)
        .then((data) => setKabupatenList(data))
        .catch((error) => console.error('Error fetching kabupaten:', error))
        .finally(() => setLoadingKabupaten(false));
      setKabupaten("");
      setKecamatan("");
      setKelurahan("");
      setKabupatenList([]);
      setKecamatanList([]);
      setKelurahanList([]);
    }
  }, [provinsi]);

  // Load kecamatan saat kabupaten berubah
  useEffect(() => {
    if (kabupaten) {
      setLoadingKecamatan(true);
      fetchKecamatan(kabupaten)
        .then((data) => setKecamatanList(data))
        .catch((error) => console.error('Error fetching kecamatan:', error))
        .finally(() => setLoadingKecamatan(false));
      setKecamatan("");
      setKelurahan("");
      setKecamatanList([]);
      setKelurahanList([]);
    }
  }, [kabupaten]);

  // Load kelurahan saat kecamatan berubah
  useEffect(() => {
    if (kecamatan) {
      setLoadingKelurahan(true);
      fetchKelurahan(kecamatan)
        .then((data) => setKelurahanList(data))
        .catch((error) => console.error('Error fetching kelurahan:', error))
        .finally(() => setLoadingKelurahan(false));
      setKelurahan("");
      setKelurahanList([]);
    }
  }, [kecamatan]);

  // Effect untuk auto mode dengan debounce
  useEffect(() => {
    if (mode === "otomatis" && location.lat && location.lon) {
      setLoadingAutoLocation(true);
      setErrorAutoLocation("");
      
      // Add small delay to avoid rapid API calls
      const timeoutId = setTimeout(() => {
        reverseGeocode(location.lat, location.lon)
          .then((name) => {
            setAutoLocationName(name);
            setLoadingAutoLocation(false);
          })
          .catch((error) => {
            console.error('Reverse geocoding error:', error);
            setAutoLocationName("");
            setErrorAutoLocation("Gagal memuat nama lokasi.");
            setLoadingAutoLocation(false);
          });
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setAutoLocationName("");
      setLoadingAutoLocation(false);
      setErrorAutoLocation("");
    }
  }, [mode, location.lat, location.lon]);

  // Compose lokasiDipakai untuk query
  const lokasiDipakai = useMemo(async () => {
    if (mode === "otomatis") {
      return { lat: location.lat, lon: location.lon, label: autoLocationName || location.label || "" };
    }
    if (kelurahan) {
      const kelurahanObj = kelurahanList.find(k => k.id === kelurahan);
      const kecamatanObj = kecamatanList.find(k => k.id === kecamatan);
      const kabupatenObj = kabupatenList.find(k => k.id === kabupaten);
      const provinsiObj = provinsiList.find(p => p.id === provinsi);
      const locationName = `${kelurahanObj?.name}, ${kecamatanObj?.name}, ${kabupatenObj?.name}, ${provinsiObj?.name}, Indonesia`;
      const coordinates = await getLocationCoordinates(locationName);
      return coordinates 
        ? { ...coordinates, label: locationName }
        : { lat: null, lon: null, label: "" };
    }
    return { lat: null, lon: null, label: "" };
  }, [mode, location, provinsi, kabupaten, kecamatan, kelurahan, autoLocationName, provinsiList, kabupatenList, kecamatanList, kelurahanList]);

  // State untuk menyimpan lokasi yang sudah diproses
  const [processedLocation, setProcessedLocation] = useState({ lat: null, lon: null, label: "" });

  // Effect untuk memproses lokasi async
  useEffect(() => {
    const processLocation = async () => {
      const result = await lokasiDipakai;
      setProcessedLocation(result);
    };
    processLocation();
  }, [lokasiDipakai]);

  const {
    data: forecast = [],
    isLoading: loadingWeather,
    isError,
  } = useQuery({
    queryKey: ['weatherForecast', mode, processedLocation.lat, processedLocation.lon],
    queryFn: () => getWeatherForecast(processedLocation.lat, processedLocation.lon),
    enabled: !!processedLocation.lat && !!processedLocation.lon,
    staleTime: 1000 * 60 * 10,
  });

  const errorWeather = isError ? "Gagal memuat data cuaca." : null;

  // Cek apakah hari ini atau besok hujan
  let rainWarning = null;
  if (forecast && forecast.length > 0) {
    const todayRain = /hujan/i.test(forecast[0]?.kondisi || "");
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
    <>
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-10 pt-20 gap-8">
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent text-center lg:text-left">
              Selamat Datang{user && user.displayName ? ` ${user.displayName}` : ''}!
            </h2>
            <div className="flex items-center justify-center lg:justify-start gap-3 text-slate-300">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-lg">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>
          
          {rainWarning && (
            <div className="flex justify-center lg:justify-end">
              <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="bg-amber-500 rounded-full p-2.5 animate-bounce shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-amber-400 text-xs tracking-wider uppercase mb-1">
                      {rainWarning.label}
                    </div>
                    <div className="font-bold text-amber-300 text-lg leading-tight mb-2">
                      {rainWarning.message}
                    </div>
                    <div className="text-amber-200 text-sm leading-relaxed">
                      {rainWarning.detail}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-slate-300 mb-10 text-center lg:text-left text-lg sm:text-xl">
          Berikut prakiraan cuaca untuk 7 hari ke depan
        </p>

        <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mb-10" />

        {/* Location Controls */}
        <div className="mb-10 space-y-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <label className="font-semibold text-slate-200 flex items-center gap-3 text-lg">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mode Lokasi:
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border border-slate-600 rounded-xl px-5 py-4 bg-slate-700/70 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <option value="otomatis">Lokasi saat ini</option>
              <option value="manual">Pilih Manual</option>
            </select>
          </div>

          {mode === "manual" && (
            <div className="bg-slate-700/30 rounded-2xl p-8 border border-slate-600/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Provinsi", value: provinsi, setter: setProvinsi, options: provinsiList, loading: loadingProvinsi, disabled: false },
                  { label: "Kabupaten/Kota", value: kabupaten, setter: setKabupaten, options: kabupatenList, loading: loadingKabupaten, disabled: !provinsi },
                  { label: "Kecamatan", value: kecamatan, setter: setKecamatan, options: kecamatanList, loading: loadingKecamatan, disabled: !kabupaten },
                  { label: "Kelurahan/Desa", value: kelurahan, setter: setKelurahan, options: kelurahanList, loading: loadingKelurahan, disabled: !kecamatan }
                ].map((field, index) => (
                  <div key={index} className="space-y-3">
                    <label className="block text-sm font-medium text-slate-300">{field.label}</label>
                    <select
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full border border-slate-600 rounded-xl px-4 py-3 bg-slate-700/70 text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 disabled:bg-slate-800/50 disabled:text-slate-500 backdrop-blur-sm"
                      disabled={field.disabled || field.loading}
                    >
                      <option value="">Pilih {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                    {field.loading && (
                      <div className="flex items-center gap-2 text-sm text-emerald-400">
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        Loading...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Weather Display */}
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
          {/* Current Weather */}
          <div className="w-full lg:w-1/3 pt-10">
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-8 text-white shadow-xl border border-emerald-700/30 backdrop-blur-sm">
              <div className="mb-3">
                <div className="flex items-center gap-1 text-emerald-200 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm font-medium">Lokasi:</span>
                </div>
                <div className="text-sm font-semibold text-slate-100">
                  {mode === "otomatis" ? (
                    !navigator.onLine ? (
                      <span className="text-emerald-300">Tidak ada koneksi internet</span>
                    ) : loadingAutoLocation ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Memuat lokasi…</span>
                      </div>
                    ) : errorAutoLocation ? (
                      <span className="text-red-300">{errorAutoLocation}</span>
                    ) : !processedLocation.label || processedLocation.label === "Lokasi tidak diketahui" ? (
                      <span className="text-emerald-300">Lokasi belum terdeteksi</span>
                    ) : (
                      <span>{processedLocation.label}</span>
                    )
                  ) : (
                    !kelurahan ? (
                      <span className="text-emerald-300">Pilih lokasi manual</span>
                    ) : (
                      <span>{processedLocation.label}</span>
                    )
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {loadingWeather ? (
                  <div className="flex items-center space-x-6 animate-pulse">
                    <div className="w-20 h-20 bg-emerald-700 rounded-full" />
                    <div className="space-y-3">
                      <div className="w-24 h-10 bg-emerald-700 rounded" />
                      <div className="w-28 h-5 bg-emerald-700 rounded" />
                    </div>
                  </div>
                ) : errorWeather ? (
                  <span className="text-red-300 text-sm">{errorWeather}</span>
                ) : forecast.length > 0 ? (
                  <>
                      <div className="text-center">
                        <span className="text-5xl drop-shadow-lg">{forecast[0].icon}</span>
                        <div className="text-2xl font-bold mb-2">{forecast[0].suhu}</div>
                        <div className="text-emerald-200 text-md">{forecast[0].kondisi}</div>
                      </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {loadingWeather ? (
                Array.from({ length: 7 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-700/50 rounded-2xl p-5 space-y-4 animate-pulse backdrop-blur-sm"
                  >
                    <div className="w-full h-4 bg-slate-600 rounded" />
                    <div className="w-10 h-10 bg-slate-600 rounded-full mx-auto" />
                    <div className="w-full h-4 bg-slate-600 rounded" />
                    <div className="w-full h-3 bg-slate-600 rounded" />
                  </div>
                ))
              ) : (
                forecast.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      bg-slate-700/40 border-2 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer backdrop-blur-sm
                      ${index === 0 
                        ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-800/30 to-emerald-700/30 shadow-emerald-500/20' 
                        : 'border-slate-600/50 hover:border-emerald-500/50 hover:bg-slate-600/50'
                      }
                    `}
                  >
                    <div className="space-y-3">
                      <span className="font-semibold text-slate-200 text-sm sm:text-base block">{day.hari}</span>
                      <span className="text-3xl sm:text-4xl block">{day.icon}</span>
                      <span className="font-bold text-emerald-300 text-lg sm:text-xl block">{day.suhu}</span>
                      <span className="text-slate-300 text-xs leading-tight block">{day.kondisi}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
    </>
  );
}