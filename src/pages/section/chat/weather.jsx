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
    <section className="bg-green-50 py-1">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
          <div>
            <h2 className="text-3xl font-bold text-green-800 text-center sm:text-left mb-1 sm:mb-0">
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

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <label className="font-medium text-gray-700">Mode Lokasi:</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="otomatis">Lokasi saat ini</option>
              <option value="manual">Pilih Manual</option>
            </select>
          </div>

          {mode === "manual" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi</label>
                <select
                  value={provinsi}
                  onChange={(e) => setProvinsi(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={loadingProvinsi}
                >
                  <option value="">Pilih Provinsi</option>
                  {provinsiList.map((prov) => (
                    <option key={prov.id} value={prov.id}>{prov.name}</option>
                  ))}
                </select>
                {loadingProvinsi && <div className="text-sm text-gray-500 mt-1">Loading...</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten/Kota</label>
                <select
                  value={kabupaten}
                  onChange={(e) => setKabupaten(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={!provinsi || loadingKabupaten}
                >
                  <option value="">Pilih Kabupaten/Kota</option>
                  {kabupatenList.map((kab) => (
                    <option key={kab.id} value={kab.id}>{kab.name}</option>
                  ))}
                </select>
                {loadingKabupaten && <div className="text-sm text-gray-500 mt-1">Loading...</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
                <select
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={!kabupaten || loadingKecamatan}
                >
                  <option value="">Pilih Kecamatan</option>
                  {kecamatanList.map((kec) => (
                    <option key={kec.id} value={kec.id}>{kec.name}</option>
                  ))}
                </select>
                {loadingKecamatan && <div className="text-sm text-gray-500 mt-1">Loading...</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kelurahan/Desa</label>
                <select
                  value={kelurahan}
                  onChange={(e) => setKelurahan(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  disabled={!kecamatan || loadingKelurahan}
                >
                  <option value="">Pilih Kelurahan/Desa</option>
                  {kelurahanList.map((kel) => (
                    <option key={kel.id} value={kel.id}>{kel.name}</option>
                  ))}
                </select>
                {loadingKelurahan && <div className="text-sm text-gray-500 mt-1">Loading...</div>}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="w-full md:w-1/3 px-4 md:px-0 md:pr-8 md:border-r md:border-green-200">
            <div className="mb-3">
              <span className="text-base font-medium text-gray-700">Lokasi:</span>{" "}
              {mode === "otomatis" ? (
                !navigator.onLine ? (
                  <span className="text-gray-400 font-semibold ml-2">Tidak ada koneksi internet</span>
                ) : loadingAutoLocation ? (
                  <span className="text-green-800 font-semibold animate-pulse ml-2">Memuat lokasi…</span>
                ) : errorAutoLocation ? (
                  <span className="text-red-500 font-semibold ml-2">{errorAutoLocation}</span>
                ) : !processedLocation.label || processedLocation.label === "Lokasi tidak diketahui" ? (
                  <span className="text-gray-400 font-semibold ml-2">Lokasi belum terdeteksi</span>
                ) : (
                  <span className="text-green-800 font-semibold ml-2">{processedLocation.label}</span>
                )
              ) : (
                !kelurahan ? (
                  <span className="text-gray-400 font-semibold ml-2">Pilih lokasi manual</span>
                ) : (
                  <span className="text-green-800 font-semibold ml-2">{processedLocation.label}</span>
                )
              )}
            </div>
            <div className="min-h-[140px]">
              {loadingWeather && (
                <div className="flex flex-col animate-pulse">
                  <div className="w-16 h-16 bg-green-100 rounded-full mb-2" />
                  <div className="w-24 h-7 bg-green-100 rounded mb-2" />
                  <div className="w-20 h-5 bg-green-100 rounded mb-2" />
                </div>
              )}
              {errorWeather && <span className="text-red-500 text-sm">{errorWeather}</span>}
              {!loadingWeather && !errorWeather && forecast.length > 0 && (
                <>
                  <span className="text-5xl">{forecast[0].icon}</span>
                  <div className="text-3xl font-bold text-green-700">{forecast[0].suhu}</div>
                  <div className="text-gray-600 text-md mb-2">{forecast[0].kondisi}</div>
                </>
              )}
            </div>
          </div>

          <div className="w-full md:flex-1">
            <h3 className="text-xl font-semibold text-green-700 mb-4 text-center md:text-left">
              Prakiraan 7 Hari ke Depan
            </h3>

            <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto md:overflow-visible pb-2">
              {loadingWeather ? (
                Array.from({ length: 7 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center bg-green-100 rounded-xl px-4 py-3 min-w-[110px] md:min-w-0 shadow-sm animate-pulse"
                  >
                    <div className="w-16 h-4 bg-green-200 rounded mb-2" />
                    <div className="w-8 h-8 bg-green-200 rounded-full mb-2" />
                    <div className="w-16 h-4 bg-green-200 rounded mb-2" />
                    <div className="w-20 h-3 bg-green-200 rounded" />
                  </div>
                ))
              ) : (
                forecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center bg-green-100 rounded-xl px-4 py-3 min-w-[110px] md:min-w-0 shadow-sm hover:scale-105 transition-all"
                  >
                    <span className="font-semibold text-gray-700 mb-1">{day.hari}</span>
                    <span className="text-2xl mb-1">{day.icon}</span>
                    <span className="font-bold text-green-700 text-sm">{day.suhu}</span>
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