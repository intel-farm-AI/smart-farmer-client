import { useEffect, useState } from "react";

const kodeCuaca = {
  0: { emoji: "☀️", kondisi: "Cerah" },
  1: { emoji: "🌤️", kondisi: "Cerah Berawan" },
  2: { emoji: "⛅", kondisi: "Sebagian Berawan" },
  3: { emoji: "☁️", kondisi: "Mendung" },
  45: { emoji: "🌫️", kondisi: "Berkabut" },
  48: { emoji: "🌫️", kondisi: "Kabut Tebal" },
  51: { emoji: "🌦️", kondisi: "Gerimis Ringan" },
  53: { emoji: "🌦️", kondisi: "Gerimis Sedang" },
  55: { emoji: "🌧️", kondisi: "Gerimis Lebat" },
  56: { emoji: "🌧️", kondisi: "Gerimis Beku Ringan" },
  57: { emoji: "🌧️", kondisi: "Gerimis Beku Lebat" },
  61: { emoji: "🌧️", kondisi: "Hujan Ringan" },
  63: { emoji: "🌧️", kondisi: "Hujan Sedang" },
  65: { emoji: "🌧️", kondisi: "Hujan Lebat" },
  66: { emoji: "❄️", kondisi: "Hujan Beku Ringan" },
  67: { emoji: "❄️", kondisi: "Hujan Beku Lebat" },
  71: { emoji: "❄️", kondisi: "Salju Ringan" },
  73: { emoji: "❄️", kondisi: "Salju Sedang" },
  75: { emoji: "❄️", kondisi: "Salju Lebat" },
  77: { emoji: "🌨️", kondisi: "Kristal Salju" },
  80: { emoji: "🌦️", kondisi: "Hujan Lokal Ringan" },
  81: { emoji: "🌧️", kondisi: "Hujan Lokal Sedang" },
  82: { emoji: "🌧️", kondisi: "Hujan Lokal Lebat" },
  85: { emoji: "🌨️", kondisi: "Salju Lokal Ringan" },
  86: { emoji: "🌨️", kondisi: "Salju Lokal Lebat" },
  95: { emoji: "⛈️", kondisi: "Badai Petir" },
  96: { emoji: "⛈️⚡", kondisi: "Badai Petir + Hujan Es Ringan" },
  99: { emoji: "⛈️❄️", kondisi: "Badai Petir + Hujan Es Lebat" },
};

export function Weather() {
  const [location, setLocation] = useState({ lat: null, lon: null, label: "Mendeteksi lokasi..." });
  const [forecast, setForecast] = useState([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [errorWeather, setErrorWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({
            lat: latitude,
            lon: longitude,
            label: `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`
          });
        },
        () => setLocation({ lat: null, lon: null, label: "Lokasi tidak tersedia" })
      );
    } else {
      setLocation({ lat: null, lon: null, label: "Geolocation tidak didukung" });
    }
  }, []);

  useEffect(() => {
    if (location.lat && location.lon) {
      setLoadingWeather(true);
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const newForecast = data.daily.time.map((tanggal, i) => {
            const kode = data.daily.weathercode[i];
            const suhuMax = Math.round(data.daily.temperature_2m_max[i]);
            const suhuMin = Math.round(data.daily.temperature_2m_min[i]);

            const hari = new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long" });

            return {
              hari,
              icon: kodeCuaca[kode]?.emoji || "❔",
              kondisi: kodeCuaca[kode]?.kondisi || "Tidak diketahui",
              suhu: `${suhuMax}°C / ${suhuMin}°C`,
            };
          });

          setForecast(newForecast);
          setLoadingWeather(false);
        })
        .catch(() => {
          setErrorWeather("Gagal memuat data cuaca.");
          setLoadingWeather(false);
        });
    }
  }, [location.lat, location.lon]);

  return (
    <section className="bg-lime-50 py-10">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-lime-800 mb-2 text-center sm:text-left">
          Selamat Datang di SmartFarm AI!
        </h2>
        <p className="text-gray-600 mb-5 text-center sm:text-left">
          Berikut ramalan cuaca untuk 7 hari ke depan
        </p>
        <hr className="border border-gray-100 mb-6" />

        <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
          <div className="w-full md:w-1/3 px-4 md:px-0 md:pr-8 md:border-r md:border-lime-200">
            <div className="mb-3">
              <span className="text-base font-medium text-gray-700">Lokasi:</span>{" "}
              <span className="text-lime-800 font-semibold">{location.label}</span>
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