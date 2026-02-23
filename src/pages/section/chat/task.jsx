import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "../../../lib/services/firebase";
import TaskFormModal from "../../../components/modal/taskFormModal";
import { FiCheckCircle, FiCircle, FiX, FiPlus, FiCalendar, FiTrendingUp } from "react-icons/fi";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  // Format tanggal ke Indonesia (untuk tampilan UI)
  const formatTanggalIndo = (dateStr) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const [year, month, day] = dateStr.split("-"); // "2025-08-19"
    return `${parseInt(day)} ${bulanIndo[parseInt(month) - 1]} ${year}`;
  };

  // Simpan tanggal hari ini dalam format ISO (YYYY-MM-DD)
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // "2025-08-19"

  useEffect(() => {
    if (!user) return;
    const tasksRef = ref(db, `tasks/${user.uid}`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .filter((task) => task.date === todayStr); // ⬅️ filter hari ini saja
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, [user, todayStr]);

  const toggleDone = (taskId, currentStatus) => {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    update(taskRef, { done: !currentStatus });
  };

  const deleteTask = (taskId) => {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    remove(taskRef);
  };

  const completedTasks = tasks.filter(task => task.done).length;
  const totalTasks = tasks.length;

  return (
    <>
      <section className="w-full h-[500px] flex flex-col bg-slate-800/50 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/50 p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Tugas Hari Ini
            </h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
              <FiCalendar className="w-4 h-4" />
              <span>{formatTanggalIndo(todayStr)}</span>
            </div>
          </div>

          {/* Progress Badge & Add Button */}
          <div className="flex items-center gap-3 flex-wrap justify-end min-w-0 w-full sm:w-auto">
            {totalTasks > 0 && (
              <div className="flex items-center gap-3 bg-slate-700/60 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-600/50 min-w-0 w-[140px] sm:w-[220px]">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <FiTrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-bold">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="w-full bg-slate-600/50 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
              type="button"
              title="Tambah Tugas Baru"
            >
              <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Tasks Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {tasks.length === 0 ? (
            <div className="flex flex-col justify-center items-center flex-1 py-8">
              <h3 className="text-slate-300 text-lg font-semibold mb-2">Belum ada tugas</h3>
              <p className="text-slate-500 text-center mb-6">
                Hari yang produktif dimulai dengan tugas yang terencana
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <ul className="space-y-3 max-h-full overflow-y-auto scroll-smooth pr-2 custom-scrollbar">
                {tasks.map((task, index) => (
                  <li
                    key={task.id}
                    className={`
                      group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:shadow-lg
                      ${task.done
                        ? "bg-emerald-900/20 border-emerald-500/30 shadow-emerald-500/10"
                        : "bg-slate-700/40 border-slate-600/50 hover:border-emerald-500/50 hover:bg-slate-700/60"
                      }
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => toggleDone(task.id, task.done)}
                        className={`
                          flex-shrink-0 p-1 rounded-full transition-all duration-300 hover:scale-110
                          ${task.done
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-slate-400 hover:text-emerald-400"
                          }
                        `}
                        type="button"
                        title={task.done ? "Tugas selesai" : "Tandai selesai"}
                      >
                        {task.done ? (
                          <FiCheckCircle className="w-6 h-6" />
                        ) : (
                          <FiCircle className="w-6 h-6" />
                        )}
                      </button>

                      <span
                        className={`
                          text-base truncate transition-all duration-300
                          ${task.done
                            ? "line-through text-slate-500"
                            : "text-slate-200 group-hover:text-emerald-300"
                          }
                        `}
                      >
                        {task.title}
                      </span>
                    </div>

                    {task.done && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 p-2 rounded-full hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                        type="button"
                        title="Hapus tugas"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-700/50 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-slate-500 text-sm">
              {totalTasks > 0 && (
                <span>
                  {completedTasks === totalTasks ? "🎉 Semua tugas selesai!" : `${totalTasks - completedTasks} tugas tersisa`}
                </span>
              )}
            </div>
            <a
              href="/dashboard/listTasks"
              className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-2 hover:gap-3 transition-all duration-300 group"
            >
              <span>Lihat Semua Tugas</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Custom Scrollbar Styles */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(51, 65, 85, 0.3);
            border-radius: 10px;
            margin: 4px 0;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #10b981, #059669);
            border-radius: 10px;
            border: 1px solid rgba(51, 65, 85, 0.2);
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #059669, #047857);
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
          }

          .custom-scrollbar::-webkit-scrollbar-corner {
            background: transparent;
          }

          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #10b981 rgba(51, 65, 85, 0.3);
          }
        `}</style>
      </section>

      {isModalOpen && <TaskFormModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}