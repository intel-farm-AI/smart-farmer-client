import { useState, useEffect } from "react";
import { ref, push, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "../../lib/services/firebase";
import dayjs from "dayjs";

export default function TaskFormModal({ onClose }) {
  const [step, setStep] = useState("choice"); // "choice" | "basic" | "smart" | "generating" | "result" | "schedule"
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [lands, setLands] = useState([]);
  const [selectedLand, setSelectedLand] = useState(null);
  const [phase, setPhase] = useState("");
  const [capital, setCapital] = useState("");
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  useEffect(() => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) return;

    const landsRef = ref(db, `users/${uid}/lands`);
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

  const handleBasicSubmit = async () => {
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

  const handleGenerate = () => {
    if (!selectedLand || !phase || !capital) {
      setError("Isi semua form terlebih dahulu.");
      return;
    }
    setStep("generating");
    setTimeout(() => {
      const fakeStrategies = [
        {
          name: "Paket Hemat",
          cost: 200000,
          yield: "5 ton/hA",
          profit: "Rp 1,5 juta",
        },
        {
          name: "Paket Paling Untung",
          recommended: true,
          cost: 400000,
          yield: "9 ton/hA",
          profit: "Rp 3 juta",
        },
        {
          name: "Paket Maksimal",
          cost: 600000,
          yield: "10 ton/hA",
          profit: "Rp 3,5 juta",
        },
      ];
      setStrategies(fakeStrategies);
      setStep("result");
    }, 2000);
  };

  const generateWeeklySchedule = (strategy) => {
    setSelectedStrategy(strategy);
    setStep("generating");
    
    setTimeout(() => {
      // Generate jadwal mingguan berdasarkan strategi yang dipilih
      const schedule = [
        {
          day: "Senin, 22 Juli",
          task: "Pemupukan Dasar",
          status: "Terjadwal"
        },
        {
          day: "Selasa, 23 Juli",
          task: "Penyiraman",
          status: "Terjadwal"
        },
        {
          day: "Rabu, 24 Juli",
          task: "Pengecekan Hama",
          status: "Terjadwal"
        },
        {
          day: "Kamis, 25 Juli",
          task: "Penyiangan",
          status: "Terjadwal"
        },
        {
          day: "Jumat, 26 Juli",
          task: "Pemupukan Susulan",
          status: "Terjadwal"
        },
        {
          day: "Sabtu, 27 Juli",
          task: "Monitoring Cuaca",
          status: "Terjadwal"
        },
        {
          day: "Minggu, 28 Juli",
          task: "Evaluasi Mingguan",
          status: "Terjadwal"
        }
      ];
      
      setWeeklySchedule(schedule);
      setStep("schedule");
    }, 2000);
  };

  const saveScheduleToFirebase = async () => {
    const user = getAuth().currentUser;
    if (!user) return setError("Pengguna belum login.");

    try {
      for (const task of weeklySchedule) {
        const dateStr = task.day.split(", ")[1] + " 2025"; // Misal: "22 Juli 2025"
        const formattedDate = dayjs(dateStr, "D MMMM YYYY", "id").format("YYYY-MM-DD");

        await push(ref(db, `tasks/${user.uid}`), {
          title: task.task,
          date: formattedDate,
          done: false,
          strategy: selectedStrategy.name,
          landId: selectedLand,
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

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose}></div>

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative animate-modal overflow-y-auto max-h-[95vh]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            &times;
          </button>

          {step === "choice" && (
            <>
              <h2 className="text-xl font-bold mb-4">Tambah Tugas</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setStep("basic")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  Tambah Tugas Biasa
                </button>
                <button
                  onClick={() => setStep("smart")}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg"
                >
                  Tambah Tugas Pintar (AI)
                </button>
              </div>
            </>
          )}

          {step === "basic" && (
            <>
              <h2 className="text-xl font-bold mb-4">Tambah Tugas Biasa</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1">Judul Tugas</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Menyiram tanaman"
                  />
                </div>
                <div>
                  <label className="block mb-1">Tanggal Tugas</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  onClick={handleBasicSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                >
                  Tambah Tugas
                </button>
              </div>
            </>
          )}

          {step === "smart" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Tugas Pintar</h2>
              <div>
                <label className="block mb-1">Pilih Lahan</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={selectedLand || ""}
                  onChange={(e) => setSelectedLand(e.target.value)}
                >
                  <option value="">-- Pilih --</option>
                  {lands.map((land) => (
                    <option key={land.id} value={land.id}>
                      {land.name} ({land.size})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">Fase Tanam</label>
                <select
                  className="w-full border rounded-lg p-2"
                  value={phase}
                  onChange={(e) => setPhase(e.target.value)}
                >
                  <option value="">-- Pilih Fase --</option>
                  <option value="penyemaian">Penyemaian</option>
                  <option value="penanaman">Penanaman</option>
                  <option value="pertumbuhan">Pertumbuhan</option>
                  <option value="panen">Menuju Panen</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Modal Tersedia</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2"
                  value={capital}
                  onChange={(e) => setCapital(e.target.value)}
                  placeholder="Rp"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={handleGenerate}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Generate Strategi Tugas
              </button>
            </div>
          )}

          {step === "generating" && (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">
                {selectedStrategy ? "Sedang membuat jadwal mingguan..." : "Sedang menghasilkan strategi terbaik..."}
              </p>
            </div>
          )}

          {step === "result" && (
            <div>
              <h2 className="text-xl font-bold mb-3">Strategi Harian</h2>
              <div className="space-y-4">
                {strategies.map((s, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 ${
                      s.recommended ? "border-green-500 bg-green-50" : ""
                    }`}
                  >
                    <h3 className="text-lg font-semibold text-green-700 flex justify-between">
                      {s.name}
                      {s.recommended && (
                        <span className="text-sm text-green-600 font-bold">Direkomendasikan</span>
                      )}
                    </h3>
                    <p className="text-sm">Modal: Rp {s.cost.toLocaleString()}</p>
                    <p className="text-sm">Hasil: {s.yield}</p>
                    <p className="text-sm">Keuntungan: {s.profit}</p>
                    
                    <button
                      onClick={() => generateWeeklySchedule(s)}
                      className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      Pilih Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === "schedule" && (
            <div>
              <h2 className="text-xl font-bold mb-3 text-center">Jadwal Kerja Mingguan</h2>
              <p className="text-center text-sm text-gray-600 mb-4">
                Rencana telah dibuat untuk minggu 22-28 Juli 2025
              </p>
              
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {weeklySchedule.map((task, i) => (
                  <div key={i} className="border-l-4 border-green-500 bg-green-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-700">{task.day}</p>
                        <p className="font-semibold text-green-800">{task.task}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-pink-600">🕐 {task.time}</span>
                        </div>
                      </div>
                      <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={saveScheduleToFirebase}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                >
                  Simpan Jadwal ke Kalender
                </button>
                <button
                  onClick={() => setStep("result")}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium"
                >
                  Kembali ke Strategi
                </button>
              </div>
            </div>
          )}

          {showToast && (
            <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-5 py-2 rounded-lg shadow-lg animate-toast">
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
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes toastUp {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-modal {
            animation: fadeInModal 0.3s ease-out;
          }

          .animate-toast {
            animation: toastUp 0.3s ease-out;
          }
        `}
      </style>
    </>
  );
}