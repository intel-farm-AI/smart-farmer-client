import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "../../lib/services/firebase";
import dayjs from "dayjs";
import { strategiesPadi, schedulePadi, strategiesJagung, scheduleJagung, strategiesCabai, scheduleCabai } from "../../lib/data/strategies";

export default function TaskFormModal({ onClose }) {
  // State Management
  const [step, setStep] = useState("choice");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [commodity, setCommodity] = useState("");
  const [phase, setPhase] = useState("");
  const [capital, setCapital] = useState("");
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Firebase Listeners
  useEffect(() => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    const landsRef = ref(db, `/lands/${uid}`);
    const unsubscribe = onValue(landsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const landsArr = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setLands(landsArr);
      }
    });

    return () => unsubscribe();
  }, []);

  // Form Handlers
  const handleBasicSubmit = async () => {
    setError("");
    
    if (!title.trim()) return setError("Judul tugas tidak boleh kosong.");
    if (!date) return setError("Tanggal tugas wajib diisi.");

    const user = getAuth().currentUser;
    if (!user) return setError("Pengguna belum login.");

    try {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");

      await push(ref(db, `tasks/${user.uid}`), {
        title,
        date: formattedDate,
        done: false,
      });
      
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan tugas.");
    }
  };

  const getStrategiesByCommodity = (commodityType) => {
    switch (commodityType) {
      case "padi":
        return strategiesPadi;
      case "jagung":
        return strategiesJagung;
      case "cabai":
        return strategiesCabai;
      default:
        return strategiesPadi;
    }
  };

  const getScheduleByCommodity = (commodityType) => {
    switch (commodityType) {
      case "padi":
        return schedulePadi;
      case "jagung":
        return scheduleJagung;
      case "cabai":
        return scheduleCabai;
      default:
        return schedulePadi;
    }
  };

  const handleGenerate = () => {
    setError("");
    
    if (!selectedLand || !commodity || !phase || !capital) {
      setError("Isi semua form terlebih dahulu.");
      return;
    }
    
    setStep("generating");
    
    setTimeout(() => {
      const strategiesByType = getStrategiesByCommodity(commodity);
      setStrategies(strategiesByType);
      setStep("result");
    }, 2000);
  };

  const generateWeeklySchedule = (strategy) => {
    setSelectedStrategy(strategy);
    setStep("generating");
    
    setTimeout(() => {
      const scheduleByType = getScheduleByCommodity(commodity);
      setWeeklySchedule(scheduleByType);
      setStep("schedule");
    }, 2000);
  };

  const saveScheduleToFirebase = async () => {
    const user = getAuth().currentUser;
    if (!user) return setError("Pengguna belum login.");

    try {
      for (const task of weeklySchedule) {
        const today = new Date();
        const dayNumber = parseInt(task.day.split(" ")[1]);
        const taskDate = new Date(today.getTime() + (dayNumber * 24 * 60 * 60 * 1000));
        const formattedDate = dayjs(taskDate).format("YYYY-MM-DD");

        await push(ref(db, `tasks/${user.uid}`), {
          title: task.task,
          date: formattedDate,
          done: false,
          strategy: selectedStrategy.name,
          landId: selectedLand,
          commodity: commodity,
        });
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan jadwal.");
    }
  };

  // Component Renders
  const renderChoiceStep = () => (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Tambah Tugas</h1>
        <p className="text-slate-400">Pilih jenis tugas yang ingin dibuat</p>
      </header>
      
      <div className="space-y-4">
        <button
          onClick={() => setStep("basic")}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:from-emerald-500 focus:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
          type="button"
          aria-describedby="basic-task-desc"
        >
          <div className="flex items-center justify-center space-x-3">
            <span>Tambah Tugas Biasa</span>
          </div>
        </button>
        <p id="basic-task-desc" className="sr-only">Buat tugas sederhana dengan detail manual</p>
        
        <button
          onClick={() => setStep("smart")}
          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 focus:from-slate-500 focus:to-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg border border-emerald-500/30"
          type="button"
          aria-describedby="smart-task-desc"
        >
          <div className="flex items-center justify-center space-x-3">
            <span>Tambah Tugas Pintar (AI)</span>
          </div>
        </button>
        <p id="smart-task-desc" className="sr-only">Biarkan AI membuat strategi terbaik untuk lahan Anda</p>
      </div>
    </div>
  );

  const renderBasicStep = () => (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Tugas Biasa</h2>
        <p className="text-slate-400">Buat tugas sederhana dengan detail manual</p>
      </header>
      
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleBasicSubmit(); }}>
        <div>
          <label htmlFor="task-title" className="block text-slate-300 font-medium mb-2">
            Judul Tugas <span className="text-red-400" aria-label="wajib diisi">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Menyiram tanaman"
            required
            aria-describedby={error ? "error-message" : undefined}
          />
        </div>
        
        <div>
          <label htmlFor="task-date" className="block text-slate-300 font-medium mb-2">
            Tanggal Tugas <span className="text-red-400" aria-label="wajib diisi">*</span>
          </label>
          <input
            id="task-date"
            type="date"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        
        {error && (
          <div role="alert" id="error-message" className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:from-emerald-500 focus:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Tambah Tugas
        </button>
      </form>
    </div>
  );

  const renderSmartStep = () => (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Tugas Pintar AI</h2>
        <p className="text-slate-400">Biarkan AI membuat strategi terbaik untuk lahan Anda</p>
      </header>
      
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
        <div>
          <label htmlFor="land-select" className="block text-slate-300 font-medium mb-2">
            Pilih Lahan <span className="text-red-400" aria-label="wajib diisi">*</span>
          </label>
          <select
            id="land-select"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            value={selectedLand || ""}
            onChange={(e) => setSelectedLand(e.target.value)}
            required
          >
            <option value="">-- Pilih Lahan --</option>
            {lands.map((land) => (
              <option key={land.id} value={land.id}>
                {land.name} ({land.size})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="commodity-select" className="block text-slate-300 font-medium mb-2">
            Komoditas <span className="text-red-400" aria-label="wajib diisi">*</span>
          </label>
          <select
            id="commodity-select"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            required
          >
            <option value="">-- Pilih Komoditas --</option>
            <option value="padi">Padi</option>
            <option value="jagung">Jagung</option>
            <option value="cabai">Cabai</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="phase-select" className="block text-slate-300 font-medium mb-2">
            Fase Tanam <span className="text-red-400" aria-label="wajib diisi">*</span>
          </label>
          <select
            id="phase-select"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
            required
          >
            <option value="">-- Pilih Fase --</option>
            <option value="penyemaian">Penyemaian</option>
            <option value="penanaman">Penanaman</option>
            <option value="pertumbuhan">Pertumbuhan</option>
            <option value="panen">Menuju Panen</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="capital-input" className="block text-slate-300 font-medium mb-2">
            Modal Tersedia <span className="text-red-400" aria-label="wajib diisi">*</span>
          </label>
          <input
            id="capital-input"
            type="number"
            min="0"
            step="1000"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="Masukkan modal dalam Rupiah"
            required
            aria-describedby="capital-help"
          />
          <p id="capital-help" className="text-xs text-slate-500 mt-1">Masukkan modal yang tersedia untuk investasi pertanian</p>
        </div>
        
        {error && (
          <div role="alert" className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:from-emerald-500 focus:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Generate Strategi AI
        </button>
      </form>
    </div>
  );

  const renderGeneratingStep = () => (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500" aria-hidden="true"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-300 opacity-20" aria-hidden="true"></div>
        <span className="sr-only">Sedang memproses...</span>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          {selectedStrategy ? "Menyusun Jadwal Operasional..." : "Menganalisis Data Pertanian..."}
        </h3>
        <p className="text-slate-400">
          {selectedStrategy 
            ? "AI sedang membuat jadwal kerja yang optimal untuk strategi Anda" 
            : "AI sedang menganalisis kondisi lahan dan menghasilkan strategi terbaik"
          }
        </p>
      </div>
    </div>
  );

  const renderResultStep = () => (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Strategi Rekomendasi</h2>
        <p className="text-slate-400">Pilih paket yang sesuai dengan modal dan target Anda</p>
      </header>
      
      <div className="space-y-4 max-h-80 overflow-y-auto" role="group" aria-labelledby="strategies-heading">
        <h3 id="strategies-heading" className="sr-only">Daftar strategi yang tersedia</h3>
        {strategies.map((strategy, index) => (
          <article
            key={index}
            className={`relative overflow-hidden rounded-xl border transition-all duration-300 focus-within:scale-105 hover:scale-105 ${
              strategy.recommended 
                ? "border-emerald-500 bg-gradient-to-br from-emerald-900/50 to-emerald-800/30" 
                : "border-slate-600 bg-slate-800/50"
            }`}
          >
            {strategy.recommended && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg" aria-label="Strategi terbaik">
                Terbaik
              </div>
            )}
            
            <div className="p-6 space-y-4">
              <h4 className="text-xl font-bold text-white">{strategy.name}</h4>
              
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Modal:</dt>
                  <dd className="text-emerald-400 font-semibold">Rp {strategy.cost.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Hasil:</dt>
                  <dd className="text-white font-semibold">{strategy.yield}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Keuntungan:</dt>
                  <dd className="text-emerald-400 font-semibold">{strategy.profit}</dd>
                </div>
              </dl>
              
              <button
                onClick={() => generateWeeklySchedule(strategy)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:from-emerald-500 focus:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                aria-describedby={`strategy-${index}-desc`}
              >
                Pilih Strategi Ini
              </button>
              <p id={`strategy-${index}-desc`} className="sr-only">
                Pilih {strategy.name} dengan modal {strategy.cost.toLocaleString()} rupiah
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const renderScheduleStep = () => (
    <div className="space-y-6">
      <header className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Jadwal Operasional</h2>
        <p className="text-slate-400">
          Rencana kerja untuk {selectedStrategy?.name} - {commodity?.toUpperCase()}
        </p>
      </header>
      
      <div className="space-y-3 max-h-80 overflow-y-auto" role="group" aria-labelledby="schedule-heading">
        <h3 id="schedule-heading" className="sr-only">Daftar jadwal operasional</h3>
        {weeklySchedule.map((task, index) => (
          <article
            key={index}
            className="bg-slate-800/50 border border-slate-600 rounded-lg p-4 hover:bg-slate-700/50 focus-within:bg-slate-700/50 transition-all duration-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <time className="text-emerald-400 font-semibold text-sm">{task.day}</time>
                  <span className="bg-emerald-900/50 text-emerald-300 text-xs px-2 py-1 rounded-full">
                    {task.status}
                  </span>
                </div>
                <h4 className="text-white font-medium">{task.task}</h4>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className="space-y-3">
        <button
          onClick={saveScheduleToFirebase}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:from-emerald-500 focus:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
        >
          Simpan Jadwal ke Kalender
        </button>
        
        <button
          onClick={() => setStep("result")}
          className="w-full bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 text-slate-300 py-3 rounded-lg font-medium transition-all duration-300"
        >
          Kembali ke Strategi
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative overflow-y-auto max-h-[95vh] animate-modal">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 cursor-pointer text-slate-400 hover:text-red-400 focus:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/50 text-2xl font-bold transition-colors duration-200 z-10 rounded"
            aria-label="Tutup modal"
          >
            x
          </button>

          {/* Content */}
          <main className="mt-4">
            {step === "choice" && renderChoiceStep()}
            {step === "basic" && renderBasicStep()}
            {step === "smart" && renderSmartStep()}
            {step === "generating" && renderGeneratingStep()}
            {step === "result" && renderResultStep()}
            {step === "schedule" && renderScheduleStep()}
          </main>

          {/* Toast */}
          {showToast && (
            <div 
              role="status" 
              aria-live="polite"
              className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-toast"
            >
              {step === "schedule" ? "Jadwal berhasil disimpan!" : "Tugas berhasil ditambahkan!"}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">
        {`
          @keyframes fadeInModal {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes toastUp {
            0% {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          .animate-modal {
            animation: fadeInModal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          .animate-toast {
            animation: toastUp 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
}