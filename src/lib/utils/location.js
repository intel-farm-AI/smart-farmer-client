// Utility functions for Indonesian location API and geocoding

// Fetch all provinces
export async function fetchProvinsi() {
  const response = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
  return response.json();
}

// Fetch regencies/cities by province ID
export async function fetchKabupaten(provinsiId) {
  const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsiId}.json`);
  return response.json();
}

// Fetch districts by regency/city ID
export async function fetchKecamatan(kabupatenId) {
  const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabupatenId}.json`);
  return response.json();
}

// Fetch villages by district ID
export async function fetchKelurahan(kecamatanId) {
  const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecamatanId}.json`);
  return response.json();
}

// Get coordinates from location name (with cache)
export async function getLocationCoordinates(locationName) {
  const cacheKey = `geocode_${locationName}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const geocodingAttempts = [
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&countrycodes=id&limit=1&addressdetails=1`,
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName + ", Indonesia")}&limit=1&addressdetails=1`,
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&countrycodes=id&limit=3&addressdetails=1&dedupe=1`
  ];

  for (const url of geocodingAttempts) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.length > 0) {
        const bestResult = data.find(item => 
          item.address && (
            item.address.city === "Jakarta" || 
            item.address.state === "Daerah Khusus Ibukota Jakarta" ||
            item.display_name.includes("Jakarta")
          )
        ) || data[0];
        const coordinates = {
          lat: parseFloat(bestResult.lat),
          lon: parseFloat(bestResult.lon)
        };
        localStorage.setItem(cacheKey, JSON.stringify(coordinates));
        return coordinates;
      }
    } catch {
      continue;
    }
  }
  return null;
}

// Reverse geocode lat/lon to address (with cache)
export async function reverseGeocode(lat, lon) {
  const cacheKey = `reverseGeocode_${lat}_${lon}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return cached;
  }
  const attempts = [
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=id`,
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1&extratags=1&accept-language=id`,
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&addressdetails=1&accept-language=id`
  ];
  for (const url of attempts) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data && data.address) {
        const address = data.address;
        let result = "Lokasi tidak diketahui";
        const parts = [];
        if (address.city === "Jakarta" || address.state === "Daerah Khusus Ibukota Jakarta") {
          if (address.suburb) parts.push(address.suburb);
          if (address.city_district) parts.push(address.city_district);
          if (address.city) parts.push(address.city);
          if (address.state) parts.push(address.state);
        } else {
          if (address.village) parts.push(address.village);
          if (address.hamlet && !parts.includes(address.hamlet)) parts.push(address.hamlet);
          if (address.suburb && !parts.includes(address.suburb)) parts.push(address.suburb);
          if (address.town && !parts.includes(address.town)) parts.push(address.town);
          if (address.city_district && !parts.includes(address.city_district)) parts.push(address.city_district);
          if (address.county && !parts.includes(address.county)) parts.push(address.county);
          if (address.city && !parts.includes(address.city)) parts.push(address.city);
          if (address.state_district && !parts.includes(address.state_district)) parts.push(address.state_district);
          if (address.state && !parts.includes(address.state)) parts.push(address.state);
        }
        if (parts.length > 0) {
          result = parts.join(", ");
          localStorage.setItem(cacheKey, result);
          return result;
        }
      }
    } catch {
      continue;
    }
  }
  return "Lokasi tidak diketahui";
}
