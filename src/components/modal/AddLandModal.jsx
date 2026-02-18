import { useState, useEffect, useContext, useCallback, useMemo } from "react";
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

const FormField = ({
  label,
  children,
  required = false,
  error = null,
  id
}) => (
  <div className="space-y-2">
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-200"
    >
      {label}
      {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-sm text-red-400" role="alert" aria-live="polite">
        {error}
      </p>
    )}
  </div>
);

const LoadingSpinner = ({ size = "sm" }) => (
  <div
    className={`animate-spin rounded-full border-2 border-emerald-400 border-t-transparent ${size === "sm" ? "h-4 w-4" : "h-6 w-6"
      }`}
    role="status"
    aria-label="Loading"
  />
);

const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses = "px-4 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 disabled:hover:bg-emerald-600",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500 disabled:hover:bg-slate-700",
    ghost: "text-slate-400 hover:text-slate-200 hover:bg-slate-800 focus:ring-slate-500"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "",
  disabled = false,
  loading = false,
  id,
  name,
  required = false,
  ...props
}) => (
  <div className="relative">
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      required={required}
      className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 appearance-none"
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value || option.id} value={option.value || option.id}>
          {option.label || capitalizeWords(option.name)}
        </option>
      ))}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
    </div>
  </div>
);

const Input = ({
  type = "text",
  value,
  onChange,
  placeholder = "",
  disabled = false,
  id,
  name,
  required = false,
  min,
  step,
  ...props
}) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    required={required}
    min={min}
    step={step}
    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
    {...props}
  />
);

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div key={i} className="flex items-center">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${i + 1 <= currentStep
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-700 text-slate-400'
            }`}
        >
          {i + 1}
        </div>
        {i < totalSteps - 1 && (
          <div
            className={`w-12 h-0.5 mx-2 transition-colors duration-200 ${i + 1 < currentStep ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
          />
        )}
      </div>
    ))}
  </div>
);

export default function AddLandModal({ open, onClose }) {
  const { location } = useContext(LocationContext);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});

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

  const [locationData, setLocationData] = useState({
    provinsiList: [],
    kabupatenList: [],
    kecamatanList: [],
    kelurahanList: [],
  });

  const [loadingStates, setLoadingStates] = useState({
    provinsi: false,
    kabupaten: false,
    kecamatan: false,
    kelurahan: false,
    autoLocation: false,
    submit: false,
  });

  const [autoLocationName, setAutoLocationName] = useState("");

  // Memoized crop options for better performance
  const cropSelectOptions = useMemo(() =>
    cropOptions.map(crop => ({ value: crop, label: crop })),
    []
  );

  // Optimized form update function
  const updateForm = useCallback((updates) => {
    setForm(prev => ({ ...prev, ...updates }));
    // Clear related errors when field is updated
    const updatedFields = Object.keys(updates);
    if (updatedFields.some(field => errors[field])) {
      setErrors(prev => {
        const newErrors = { ...prev };
        updatedFields.forEach(field => delete newErrors[field]);
        return newErrors;
      });
    }
  }, [errors]);

  // Load provinsi data when switching to manual mode
  useEffect(() => {
    if (form.locationMode === "manual" && locationData.provinsiList.length === 0) {
      setLoadingStates(prev => ({ ...prev, provinsi: true }));
      fetchProvinsi()
        .then((data) => setLocationData(prev => ({ ...prev, provinsiList: data })))
        .catch((err) => setErrors(prev => ({ ...prev, provinsi: "Gagal memuat provinsi" })))
        .finally(() => setLoadingStates(prev => ({ ...prev, provinsi: false })));
    }
  }, [form.locationMode, locationData.provinsiList.length]);

  // Load kabupaten when provinsi changes
  useEffect(() => {
    if (form.provinsi) {
      setLoadingStates(prev => ({ ...prev, kabupaten: true }));
      fetchKabupaten(form.provinsi)
        .then((data) => {
          setLocationData(prev => ({
            ...prev,
            kabupatenList: data,
            kecamatanList: [],
            kelurahanList: []
          }));
          updateForm({ kabupaten: "", kecamatan: "", kelurahan: "" });
        })
        .catch((err) => setErrors(prev => ({ ...prev, kabupaten: "Gagal memuat kabupaten" })))
        .finally(() => setLoadingStates(prev => ({ ...prev, kabupaten: false })));
    }
  }, [form.provinsi, updateForm]);

  // Load kecamatan when kabupaten changes
  useEffect(() => {
    if (form.kabupaten) {
      setLoadingStates(prev => ({ ...prev, kecamatan: true }));
      fetchKecamatan(form.kabupaten)
        .then((data) => {
          setLocationData(prev => ({
            ...prev,
            kecamatanList: data,
            kelurahanList: []
          }));
          updateForm({ kecamatan: "", kelurahan: "" });
        })
        .catch((err) => setErrors(prev => ({ ...prev, kecamatan: "Gagal memuat kecamatan" })))
        .finally(() => setLoadingStates(prev => ({ ...prev, kecamatan: false })));
    }
  }, [form.kabupaten, updateForm]);

  // Load kelurahan when kecamatan changes
  useEffect(() => {
    if (form.kecamatan) {
      setLoadingStates(prev => ({ ...prev, kelurahan: true }));
      fetchKelurahan(form.kecamatan)
        .then((data) => {
          setLocationData(prev => ({ ...prev, kelurahanList: data }));
          updateForm({ kelurahan: "" });
        })
        .catch((err) => setErrors(prev => ({ ...prev, kelurahan: "Gagal memuat kelurahan" })))
        .finally(() => setLoadingStates(prev => ({ ...prev, kelurahan: false })));
    }
  }, [form.kecamatan, updateForm]);

  // Load automatic location
  useEffect(() => {
    if (form.locationMode === "otomatis" && location.lat && location.lon) {
      setLoadingStates(prev => ({ ...prev, autoLocation: true }));
      reverseGeocode(location.lat, location.lon)
        .then((name) => setAutoLocationName(name))
        .catch(() => setAutoLocationName("Lokasi tidak dapat dideteksi"))
        .finally(() => setLoadingStates(prev => ({ ...prev, autoLocation: false })));
    }
  }, [form.locationMode, location.lat, location.lon]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setErrors({});
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
    }
  }, [open]);

  const validateStep = useCallback((currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.crop) newErrors.crop = "Jenis tanaman harus dipilih";
      if (form.crop === "Lainnya" && !form.customCrop.trim()) {
        newErrors.customCrop = "Jenis tanaman lainnya harus diisi";
      }
      if (!form.name.trim()) newErrors.name = "Nama lahan harus diisi";
    } else if (currentStep === 2) {
      if (form.locationMode === "manual") {
        if (!form.provinsi) newErrors.provinsi = "Provinsi harus dipilih";
        if (!form.kabupaten) newErrors.kabupaten = "Kabupaten harus dipilih";
        if (!form.kecamatan) newErrors.kecamatan = "Kecamatan harus dipilih";
        if (!form.kelurahan) newErrors.kelurahan = "Kelurahan harus dipilih";
      }
    } else if (currentStep === 3) {
      if (!form.size || parseFloat(form.size) <= 0) {
        newErrors.size = "Luas lahan harus lebih dari 0";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleNext = useCallback(() => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  }, [step, validateStep]);

  const handleBack = useCallback(() => {
    setStep(prev => prev - 1);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validateStep(3)) return;

    setLoadingStates(prev => ({ ...prev, submit: true }));

    try {
      let lokasi = "";

      if (form.locationMode === "otomatis") {
        lokasi = autoLocationName || "Lokasi tidak ditemukan";
      } else {
        const prov = capitalizeWords(
          locationData.provinsiList.find((p) => p.id === form.provinsi)?.name || ""
        );
        const kab = capitalizeWords(
          locationData.kabupatenList.find((k) => k.id === form.kabupaten)?.name || ""
        );
        const kec = capitalizeWords(
          locationData.kecamatanList.find((k) => k.id === form.kecamatan)?.name || ""
        );
        const kel = capitalizeWords(
          locationData.kelurahanList.find((k) => k.id === form.kelurahan)?.name || ""
        );
        lokasi = [kel, kec, kab, prov].filter(Boolean).join(", ");
      }

      const crop = form.crop === "Lainnya" ? form.customCrop : form.crop;

      const uid = auth.currentUser?.uid;
      if (!uid) {
        throw new Error("Anda harus login terlebih dahulu.");
      }

      await push(ref(db, `/lands/${uid}`), {
        name: form.name,
        crop,
        location: lokasi,
        size: parseFloat(form.size),
        createdAt: Date.now(),
      });

      onClose();
    } catch (err) {
      console.error("Firebase Error:", err);
      setErrors({ submit: err.message || "Gagal menyimpan data" });
    } finally {
      setLoadingStates(prev => ({ ...prev, submit: false }));
    }
  }, [form, autoLocationName, locationData, validateStep, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const renderStep1 = () => (
    <div className="space-y-6">
      <FormField
        label="Jenis Tanaman"
        required
        error={errors.crop}
        id="crop-select"
      >
        <Select
          id="crop-select"
          name="crop"
          value={form.crop}
          onChange={(e) => updateForm({ crop: e.target.value, customCrop: "" })}
          options={cropSelectOptions}
          required
        />
      </FormField>

      {form.crop === "Lainnya" && (
        <FormField
          label="Jenis Tanaman Lainnya"
          required
          error={errors.customCrop}
          id="custom-crop"
        >
          <Input
            id="custom-crop"
            name="customCrop"
            value={form.customCrop}
            onChange={(e) => updateForm({ customCrop: e.target.value })}
            placeholder="Masukkan jenis tanaman"
            required
          />
        </FormField>
      )}

      <FormField
        label="Nama Lahan"
        required
        error={errors.name}
        id="land-name"
      >
        <Input
          id="land-name"
          name="name"
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
          placeholder="Contoh: Lahan Jagung Utara"
          required
        />
      </FormField>

      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          onClick={handleNext}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <FormField
        label="Mode Lokasi"
        id="location-mode"
      >
        <Select
          id="location-mode"
          name="locationMode"
          value={form.locationMode}
          onChange={(e) => updateForm({ locationMode: e.target.value })}
          options={[
            { value: "otomatis", label: "Otomatis (Lokasi Saat Ini)" },
            { value: "manual", label: "Manual" }
          ]}
        />
      </FormField>

      {form.locationMode === "otomatis" ? (
        <FormField
          label="Lokasi Otomatis"
          id="auto-location"
        >
          <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-200 min-h-[42px] flex items-center">
            {loadingStates.autoLocation ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span>Memuat lokasi...</span>
              </div>
            ) : (
              autoLocationName || "Lokasi tidak dapat dideteksi"
            )}
          </div>
        </FormField>
      ) : (
        <div className="space-y-4">
          <FormField
            label="Provinsi"
            required
            error={errors.provinsi}
            id="provinsi"
          >
            <Select
              id="provinsi"
              value={form.provinsi}
              onChange={(e) => updateForm({ provinsi: e.target.value })}
              options={locationData.provinsiList}
              placeholder="Pilih Provinsi"
              loading={loadingStates.provinsi}
              required
            />
          </FormField>

          <FormField
            label="Kabupaten/Kota"
            required
            error={errors.kabupaten}
            id="kabupaten"
          >
            <Select
              id="kabupaten"
              value={form.kabupaten}
              onChange={(e) => updateForm({ kabupaten: e.target.value })}
              options={locationData.kabupatenList}
              placeholder="Pilih Kabupaten/Kota"
              disabled={!form.provinsi}
              loading={loadingStates.kabupaten}
              required
            />
          </FormField>

          <FormField
            label="Kecamatan"
            required
            error={errors.kecamatan}
            id="kecamatan"
          >
            <Select
              id="kecamatan"
              value={form.kecamatan}
              onChange={(e) => updateForm({ kecamatan: e.target.value })}
              options={locationData.kecamatanList}
              placeholder="Pilih Kecamatan"
              disabled={!form.kabupaten}
              loading={loadingStates.kecamatan}
              required
            />
          </FormField>

          <FormField
            label="Kelurahan/Desa"
            required
            error={errors.kelurahan}
            id="kelurahan"
          >
            <Select
              id="kelurahan"
              value={form.kelurahan}
              onChange={(e) => updateForm({ kelurahan: e.target.value })}
              options={locationData.kelurahanList}
              placeholder="Pilih Kelurahan/Desa"
              disabled={!form.kecamatan}
              loading={loadingStates.kelurahan}
              required
            />
          </FormField>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="secondary"
          onClick={handleBack}
        >
          Kembali
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <FormField
        label="Luas Lahan (hektar)"
        required
        error={errors.size}
        id="land-size"
      >
        <Input
          id="land-size"
          name="size"
          type="number"
          value={form.size}
          onChange={(e) => updateForm({ size: e.target.value })}
          placeholder="Contoh: 2.5"
          min="0"
          step="0.01"
          required
        />
      </FormField>

      {errors.submit && (
        <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3" role="alert">
          {errors.submit}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button
          variant="secondary"
          onClick={handleBack}
          disabled={loadingStates.submit}
        >
          Kembali
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loadingStates.submit}
          disabled={loadingStates.submit}
        >
          Simpan Lahan
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2
              id="modal-title"
              className="text-xl font-semibold text-white"
            >
              Tambah Lahan Baru
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Tutup modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <StepIndicator currentStep={step} totalSteps={3} />

            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </div>
      </div>
    </>
  );
}