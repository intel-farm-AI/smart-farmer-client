import { useState, useEffect, useContext } from "react";
import { LocationContext } from "../../context/locationContext";
import {
  fetchProvinsi,
  fetchKabupaten,
  fetchKecamatan,
  fetchKelurahan,
  reverseGeocode,
} from "../../lib/utils/location";
import { db, auth } from "../../lib/services/firebase";
import { ref, push } from "firebase/database";

const cropOptions = [
  "Padi",
  "Jagung",
  "Kedelai",
  "Singkong",
  "Kentang",
  "Cabai",
  "Tomat",
  "Lainnya",
];

const capitalizeWords = (str) =>
  str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function AddLandModal({ open, onClose }) {
  const { location } = useContext(LocationContext);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    crop: cropOptions[0],
    customCrop: "",
    name: "",
    locationMode: "otomatis",
    location: "",
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    kelurahan: "",
    size: "",
  });

  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  const [loadingProvinsi, setLoadingProvinsi] = useState(false);
  const [loadingKabupaten, setLoadingKabupaten] = useState(false);
  const [loadingKecamatan, setLoadingKecamatan] = useState(false);
  const [loadingKelurahan, setLoadingKelurahan] = useState(false);

  const [autoLocationName, setAutoLocationName] = useState("");
  const [loadingAutoLocation, setLoadingAutoLocation] = useState(false);

  useEffect(() => {
    if (form.locationMode === "manual") {
      setLoadingProvinsi(true);
      fetchProvinsi()
        .then((data) => setProvinsiList(data))
        .finally(() => setLoadingProvinsi(false));
    }
  }, [form.locationMode]);

  useEffect(() => {
    if (form.provinsi) {
      setLoadingKabupaten(true);
      fetchKabupaten(form.provinsi)
        .then((data) => setKabupatenList(data))
        .finally(() => setLoadingKabupaten(false));
      setForm((f) => ({ ...f, kabupaten: "", kecamatan: "", kelurahan: "" }));
      setKecamatanList([]);
      setKelurahanList([]);
    }
  }, [form.provinsi]);

  useEffect(() => {
    if (form.kabupaten) {
      setLoadingKecamatan(true);
      fetchKecamatan(form.kabupaten)
        .then((data) => setKecamatanList(data))
        .finally(() => setLoadingKecamatan(false));
      setForm((f) => ({ ...f, kecamatan: "", kelurahan: "" }));
      setKelurahanList([]);
    }
  }, [form.kabupaten]);

  useEffect(() => {
    if (form.kecamatan) {
      setLoadingKelurahan(true);
      fetchKelurahan(form.kecamatan)
        .then((data) => setKelurahanList(data))
        .finally(() => setLoadingKelurahan(false));
      setForm((f) => ({ ...f, kelurahan: "" }));
    }
  }, [form.kecamatan]);

  useEffect(() => {
    if (form.locationMode === "otomatis" && location.lat && location.lon) {
      setLoadingAutoLocation(true);
      reverseGeocode(location.lat, location.lon)
        .then((name) => setAutoLocationName(name))
        .finally(() => setLoadingAutoLocation(false));
    }
  }, [form.locationMode, location.lat, location.lon]);

  if (!open) return null;

  const renderStep1 = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep(2);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Jenis Tanaman</label>
        <select
          name="crop"
          value={form.crop}
          onChange={(e) => setForm({ ...form, crop: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        >
          {cropOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      {form.crop === "Lainnya" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Jenis Tanaman Lainnya
          </label>
          <input
            name="customCrop"
            value={form.customCrop}
            onChange={(e) => setForm({ ...form, customCrop: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
            placeholder="Masukkan jenis tanaman"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Nama Lahan</label>
        <input
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
          placeholder="Contoh: Lahan Jagung"
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Lanjut
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setStep(3);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Mode Lokasi</label>
        <select
          name="locationMode"
          value={form.locationMode}
          onChange={(e) => setForm({ ...form, locationMode: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          <option value="otomatis">Otomatis (Lokasi Saat Ini)</option>
          <option value="manual">Manual</option>
        </select>
      </div>
      {form.locationMode === "otomatis" ? (
        <div>
          <label className="block text-sm font-medium mb-1">Lokasi Otomatis</label>
          <div className="px-3 py-2 border rounded bg-gray-50">
            {loadingAutoLocation
              ? "Memuat lokasi..."
              : autoLocationName || "Lokasi tidak ditemukan"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Provinsi</label>
            <select
              value={form.provinsi}
              onChange={(e) => setForm({ ...form, provinsi: e.target.value })}
              className="w-full border rounded px-3 py-2"
              disabled={loadingProvinsi}
              required
            >
              <option value="">Pilih Provinsi</option>
              {provinsiList.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {capitalizeWords(prov.name)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kabupaten/Kota</label>
            <select
              value={form.kabupaten}
              onChange={(e) => setForm({ ...form, kabupaten: e.target.value })}
              className="w-full border rounded px-3 py-2"
              disabled={!form.provinsi || loadingKabupaten}
              required
            >
              <option value="">Pilih Kabupaten/Kota</option>
              {kabupatenList.map((kab) => (
                <option key={kab.id} value={kab.id}>
                  {capitalizeWords(kab.name)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kecamatan</label>
            <select
              value={form.kecamatan}
              onChange={(e) => setForm({ ...form, kecamatan: e.target.value })}
              className="w-full border rounded px-3 py-2"
              disabled={!form.kabupaten || loadingKecamatan}
              required
            >
              <option value="">Pilih Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={kec.id}>
                  {capitalizeWords(kec.name)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kelurahan/Desa</label>
            <select
              value={form.kelurahan}
              onChange={(e) => setForm({ ...form, kelurahan: e.target.value })}
              className="w-full border rounded px-3 py-2"
              disabled={!form.kecamatan || loadingKelurahan}
              required
            >
              <option value="">Pilih Kelurahan/Desa</option>
              {kelurahanList.map((kel) => (
                <option key={kel.id} value={kel.id}>
                  {capitalizeWords(kel.name)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="flex justify-between gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setStep(1)}
        >
          Kembali
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Lanjut
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        let lokasi = "";

        if (form.locationMode === "otomatis") {
          lokasi = autoLocationName || "Lokasi tidak ditemukan";
        } else {
          const prov = capitalizeWords(
            provinsiList.find((p) => p.id === form.provinsi)?.name || ""
          );
          const kab = capitalizeWords(
            kabupatenList.find((k) => k.id === form.kabupaten)?.name || ""
          );
          const kec = capitalizeWords(
            kecamatanList.find((k) => k.id === form.kecamatan)?.name || ""
          );
          const kel = capitalizeWords(
            kelurahanList.find((k) => k.id === form.kelurahan)?.name || ""
          );
          lokasi = [kel, kec, kab, prov].filter(Boolean).join(", ");
        }

        const crop = form.crop === "Lainnya" ? form.customCrop : form.crop;

        try {
          const uid = auth.currentUser?.uid;
          if (!uid) {
            alert("Anda harus login terlebih dahulu.");
            return;
          }
          await push(ref(db, `/lands/${uid}`), {
            name: form.name,
            crop,
            location: lokasi,
            size: parseFloat(form.size),
            createdAt: Date.now(),
          });

          setForm({
            crop: cropOptions[0],
            customCrop: "",
            name: "",
            locationMode: "otomatis",
            location: "",
            provinsi: "",
            kabupaten: "",
            kecamatan: "",
            kelurahan: "",
            size: "",
          });
          setStep(1);
          onClose();
        } catch (err) {
          console.error("Firebase Error:", err);
          alert("Gagal menyimpan data: " + err.message);
        }
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Luas (hektar)</label>
        <input
          type="number"
          name="size"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
          placeholder="Contoh: 2"
          min="0"
          step="0.01"
        />
      </div>
      <div className="flex justify-between gap-2 mt-4">
        <button
          type="button"
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => setStep(2)}
        >
          Kembali
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
        >
          Simpan
        </button>
      </div>
    </form>
  );

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setStep(1);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100"
        style={{ animation: "popupFadeIn 0.3s" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4 text-green-700 text-center">
          Tambah Lahan Baru
        </h3>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
      <style>
        {`
          @keyframes popupFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}