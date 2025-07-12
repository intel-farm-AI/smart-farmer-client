import { weatherCode } from "../weatherCode";

export async function getWeatherForecast(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  const forecast = data.daily.time.map((tanggal, i) => {
    const kode = data.daily.weathercode[i];
    const suhuMax = Math.round(data.daily.temperature_2m_max[i]);
    const suhuMin = Math.round(data.daily.temperature_2m_min[i]);
    const hari = new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long" });

    return {
      hari,
      icon: weatherCode[kode]?.emoji || "❔",
      kondisi: weatherCode[kode]?.kondisi || "Tidak diketahui",
      suhu: `${suhuMax}°C / ${suhuMin}°C`,
    };
  });

  return forecast;
}
