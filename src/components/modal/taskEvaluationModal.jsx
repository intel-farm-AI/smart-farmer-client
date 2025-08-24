import { useState, useEffect } from "react";
import { ref, push, onValue, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "../../lib/services/firebase";
import dayjs from "dayjs";
import { FiCheckCircle, FiTrendingUp, FiDollarSign, FiX } from "react-icons/fi";

export default function TaskEvaluationModal({ task, onClose, onTaskComplete }) {
  const [modalUsed, setModalUsed] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [lands, setLands] = useState([]);
  const [isHarvestPhase, setIsHarvestPhase] = useState(false);
  const [landExpenses, setLandExpenses] = useState(null);
  const [expectedProfit, setExpectedProfit] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;

  // Modal options untuk input harian
  const modalOptions = [
    { value: "0", label: "Tidak ada pengeluaran", amount: 0 },
    { value: "25000", label: "Rp 25.000 - Pengeluaran kecil", amount: 25000 },
    { value: "50000", label: "Rp 50.000 - Pengeluaran sedang", amount: 50000 },
    { value: "100000", label: "Rp 100.000 - Pengeluaran besar", amount: 100000 },
    { value: "250000", label: "Rp 250.000 - Pengeluaran sangat besar", amount: 250000 },
    { value: "500000", label: "Rp 500.000 - Investasi besar", amount: 500000 },
  ];

  useEffect(() => {
    if (!user) return;

    // Load lands data
    const landsRef = ref(db, `/lands/${user.uid}`);
    const unsubscribeLands = onValue(landsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const landsArr = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setLands(landsArr);
      }
    });

    // Check if task is harvest phase
    if (task.strategy && task.landId) {
      checkHarvestPhase();
      loadLandExpenses();
    }

    return () => unsubscribeLands();
  }, [user, task]);

  const checkHarvestPhase = () => {
    // Check if task title contains harvest-related keywords
    const harvestKeywords = ['panen', 'harvest', 'hasil', 'petik', 'ambil hasil'];
    const isHarvest = harvestKeywords.some(keyword => 
      task.title.toLowerCase().includes(keyword)
    );
    setIsHarvestPhase(isHarvest);
  };

  const loadLandExpenses = async () => {
    if (!user || !task.landId) return;

    try {
      const expensesRef = ref(db, `landExpenses/${user.uid}/${task.landId}`);
      const snapshot = await get(expensesRef);
      
      if (snapshot.exists()) {
        const expenses = snapshot.val();
        const totalExpenses = Object.values(expenses).reduce((sum, expense) => sum + expense.amount, 0);
        setLandExpenses(totalExpenses);
        
        // Calculate expected profit based on strategy
        if (task.strategy && task.commodity) {
          calculateExpectedProfit(totalExpenses);
        }
      }
    } catch (error) {
      console.error("Error loading land expenses:", error);
    }
  };

  const calculateExpectedProfit = (totalExpenses) => {
    // This should match your strategy data structure
    const profitMultiplier = {
      'padi': 1.5,
      'jagung': 1.8,
      'cabai': 2.2
    };
    
    const multiplier = profitMultiplier[task.commodity] || 1.5;
    const expectedRevenue = totalExpenses * multiplier;
    const profit = expectedRevenue - totalExpenses;
    
    setExpectedProfit({
      totalExpenses,
      expectedRevenue,
      profit,
      profitPercentage: ((profit / totalExpenses) * 100).toFixed(1)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!modalUsed) {
      setError("Pilih jumlah modal yang digunakan hari ini.");
      setLoading(false);
      return;
    }

    try {
      const selectedOption = modalOptions.find(option => option.value === modalUsed);
      const today = dayjs().format("YYYY-MM-DD");

      // Save daily expense
      await push(ref(db, `landExpenses/${user.uid}/${task.landId || 'general'}`), {
        amount: selectedOption.amount,
        date: today,
        taskId: task.id,
        taskTitle: task.title,
        description: selectedOption.label,
        createdAt: Date.now()
      });

      // Mark task as complete
      if (onTaskComplete) {
        await onTaskComplete(task.id, true);
      }

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 3000);

    } catch (err) {
      console.error("Error saving expense:", err);
      setError("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const selectedLand = lands.find(land => land.id === task.landId);

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
        aria-labelledby="evaluation-modal-title"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-md relative overflow-y-auto max-h-[95vh] animate-modal">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-400 focus:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-400/50 text-2xl font-bold transition-colors duration-200 z-10 rounded"
            aria-label="Tutup modal"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="mt-4">
            {/* Congratulations Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 id="evaluation-modal-title" className="text-2xl font-bold text-white mb-2">
                🎉 Selamat!
              </h2>
              <p className="text-slate-400">
                Anda telah menyelesaikan tugas:
              </p>
              <p className="text-emerald-400 font-semibold mt-1">
                "{task.title}"
              </p>
              
              {selectedLand && (
                <p className="text-sm text-slate-500 mt-2">
                  Lahan: {selectedLand.name} ({selectedLand.size})
                </p>
              )}
            </div>

            {/* Harvest Summary (if harvest phase) */}
            {isHarvestPhase && expectedProfit && (
              <div className="bg-gradient-to-r from-emerald-900/40 to-emerald-800/30 border border-emerald-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FiTrendingUp className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-emerald-300">Ringkasan Investasi</h3>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Modal Digunakan:</span>
                    <span className="text-white font-semibold">
                      Rp {expectedProfit.totalExpenses.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Perkiraan Hasil:</span>
                    <span className="text-emerald-400 font-semibold">
                      Rp {expectedProfit.expectedRevenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-emerald-600/30 pt-2">
                    <span className="text-slate-400">Keuntungan Bersih:</span>
                    <span className="text-emerald-300 font-bold">
                      Rp {expectedProfit.profit.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-1 rounded-full">
                      ROI: {expectedProfit.profitPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Expense Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-used" className="block text-slate-300 font-medium mb-3">
                  <FiDollarSign className="inline w-4 h-4 mr-2" />
                  Berapa modal yang Anda gunakan hari ini?
                </label>
                <select
                  id="modal-used"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  value={modalUsed}
                  onChange={(e) => setModalUsed(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Pengeluaran --</option>
                  {modalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Catat pengeluaran harian untuk tracking yang lebih akurat
                </p>
              </div>

              {error && (
                <div role="alert" className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg">
                  <strong>Error:</strong> {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 text-slate-300 py-3 rounded-lg font-medium transition-all duration-300"
                >
                  Batal
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 focus:from-emerald-500 focus:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Menyimpan...</span>
                    </div>
                  ) : (
                    "Selesaikan Tugas"
                  )}
                </button>
              </div>
            </form>

            {/* Tips */}
            <div className="mt-6 p-4 bg-slate-700/30 border border-slate-600/30 rounded-lg">
              <p className="text-xs text-slate-400 text-center">
                💡 <strong>Tips:</strong> Catat setiap pengeluaran untuk mendapatkan analisis keuntungan yang akurat
              </p>
            </div>
          </div>

          {/* Toast */}
          {showToast && (
            <div 
              role="status" 
              aria-live="polite"
              className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-toast"
            >
              {isHarvestPhase ? "🎉 Panen berhasil dicatat!" : "✅ Tugas berhasil diselesaikan!"}
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