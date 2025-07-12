import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getWeatherForecast } from "../../../lib/services/getWeatherForecast";
import { LocationContext } from "../../../context/locationContext";
import { getAuth } from "firebase/auth";

export function Weather() {
  const { location, locationChecked } = useContext(LocationContext);
  const auth = getAuth();
  const user = auth.currentUser;

  const {
    data: forecast = [],
    isLoading: loadingWeather,
    isError,
  } = useQuery({
    queryKey: ['weatherForecast', location.lat, location.lon],
    queryFn: () => getWeatherForecast(location.lat, location.lon),
    enabled: locationChecked && !!location.lat && !!location.lon,
    staleTime: 1000 * 60 * 10,
  });

  const errorWeather = isError ? "Gagal memuat data cuaca." : null;

  return (
    <section className="bg-lime-50 py-10">
      <div className="container mx-auto mt-8 px-4 sm:px-6 md:px-10 py-8 bg-white rounded-2xl shadow-sm">
        <h2 className="text-3xl font-bold text-lime-800 mb-2 text-center sm:text-left">
          Selamat Datang{user && user.displayName ? ` ${user.displayName}` : ''}!
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