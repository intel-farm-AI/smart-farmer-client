import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoaderCircle, CloudRain, ArrowLeft } from 'lucide-react';

const BASE_URL = "http://localhost:8000";

const HourlyWeatherPage = ({ lat, lon, onBack }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${BASE_URL}/weather-hourly?lat=${lat}&lon=${lon}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("RESPONS DARI /weather-hourly:", data);
      if (Array.isArray(data.data)) {
        setHourlyData(data.data);  // ✅ AMBIL DARI "data.data"
      } else {
        console.error("❌ data.data bukan array:", data.data);
        setHourlyData([]);
      }
      setLoading(false);
    })
    .catch((err) => {
      console.error("Gagal memuat data per jam:", err);
      setHourlyData([]);
      setLoading(false);
    });
}, [lat, lon]);


  // 🎯 Fungsi penentu ikon cuaca berdasarkan deskripsi
  const getWeatherIcon = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes("cerah")) return "☀️";
    if (d.includes("hujan")) return "🌧️";
    if (d.includes("berawan")) return "⛅";
    if (d.includes("mendung")) return "☁️";
    return "🌤️";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </Button>
        <h1 className="text-xl font-bold text-center text-gray-800">Prakiraan Cuaca per Jam</h1>
        <div />
      </div>

      {/* Card utama */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <CloudRain className="w-5 h-5 text-blue-500" />
            24 Jam ke Depan (Interval 3 Jam)
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8 text-gray-600">
              <LoaderCircle className="animate-spin mr-2 w-5 h-5" />
              Memuat data cuaca per jam...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {hourlyData.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition"
                >
                  <div className="text-3xl mb-1 text-center">
                    {getWeatherIcon(item.cuaca)}
                  </div>
                  <div className="text-center font-bold text-lg text-gray-800">
                    {item.jam}
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-1 mb-2">
                    {item.cuaca}
                  </div>
                  <div className="text-sm text-gray-700">💧 {item.peluang_hujan}% peluang hujan</div>
                  <div className="text-sm text-gray-700">🌡️ {item.suhu}°C</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HourlyWeatherPage;
