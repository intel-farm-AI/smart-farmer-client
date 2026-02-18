import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MainLayout } from "../layout/main";
import { db } from "../lib/services/firebase";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiX, FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "dayjs/locale/id";

dayjs.extend(isoWeek);
dayjs.extend(customParseFormat);
dayjs.locale("id");

export default function ListAllTasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const tasksRef = ref(db, `tasks/${firebaseUser.uid}`);
        onValue(tasksRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const taskList = Object.entries(data).map(([id, value]) => ({
              id,
              ...value,
            }));
            setTasks(taskList);
          } else {
            setTasks([]);
          }
          setLoading(false);
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleDone = (taskId, currentStatus) => {
    if (!user) return;
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    update(taskRef, { done: !currentStatus });
  };

  const deleteTask = (taskId) => {
    if (!user) return;
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    remove(taskRef);
  };

  const tasksByDate = tasks.reduce((acc, task) => {
    let dateStr = task.date;

    if (!dateStr) return acc;

    // Normalisasi format tanggal ke YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parsed = dayjs(dateStr, "D MMMM YYYY", "id");
      if (parsed.isValid()) {
        dateStr = parsed.format("YYYY-MM-DD");
      } else {
        return acc; // skip jika tidak bisa diparsing
      }
    }

    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(task);
    return acc;
  }, {});

  // Generate calendar days for current month
  const generateMonthDays = (monthDate) => {
    const startOfMonth = monthDate.startOf("month");
    const endOfMonth = monthDate.endOf("month");
    const startOfCalendar = startOfMonth.startOf("week");
    const endOfCalendar = endOfMonth.endOf("week");

    const days = [];
    let currentDay = startOfCalendar;

    while (currentDay.isBefore(endOfCalendar) || currentDay.isSame(endOfCalendar, "day")) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    return days;
  };

  const today = dayjs();
  const monthDays = generateMonthDays(currentMonth);
  const daysOfWeek = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const goToToday = () => {
    setCurrentMonth(dayjs());
  };

  return (
    <MainLayout withNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 mt-15 p-4 lg:p-6">
        <div className="container mx-auto">
          {/* Header */}
          <div className="mb-6 lg:mb-8">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mb-4 lg:mb-6 flex items-center gap-3 text-slate-400 hover:text-emerald-400 font-medium px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="hidden sm:inline">Kembali ke Dashboard</span>
              <span className="sm:hidden">Kembali</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 p-3 rounded-2xl shadow-lg">
                  <FiCalendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    Kalender Tugas
                  </h1>
                  <p className="text-slate-400 mt-1 flex items-center gap-2 text-sm lg:text-base">
                    <FiClock className="w-4 h-4" />
                    <span className="hidden sm:inline">Lihat semua tugas dalam tampilan kalender</span>
                    <span className="sm:hidden">Tampilan kalender</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
                <div className="flex items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
                  <span className="text-slate-300 text-lg">Memuat kalender...</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <div className="flex items-center gap-2 lg:gap-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 lg:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300 group"
                    type="button"
                  >
                    <FiChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                  </button>

                  <div className="text-center">
                    <h2 className="text-xl lg:text-2xl font-bold text-slate-200 capitalize">
                      {currentMonth.format("MMMM YYYY")}
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {monthDays.length} hari dalam kalender
                    </p>
                  </div>

                  <button
                    onClick={goToNextMonth}
                    className="p-2 lg:p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-300 group"
                    type="button"
                  >
                    <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                <button
                  onClick={goToToday}
                  className="px-3 lg:px-4 py-2 lg:py-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-all duration-300 text-sm lg:text-base font-medium"
                  type="button"
                >
                  <span className="hidden sm:inline">Hari Ini</span>
                  <span className="sm:hidden">Hari Ini</span>
                </button>
              </div>

              {/* Calendar Header - Days of Week */}
              <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4 lg:mb-6">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="text-center py-2 lg:py-3 px-2 lg:px-4 rounded-xl bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 border border-emerald-700/30"
                  >
                    <span className="text-emerald-300 font-bold text-xs lg:text-sm uppercase tracking-wider">
                      <span className="hidden sm:inline">{day}</span>
                      <span className="sm:hidden">{day.slice(0, 3)}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 lg:gap-4">
                {/* eslint-disable-next-line */}
                {monthDays.map((dateObj, idx) => {
                  const dateStr = dateObj.format("YYYY-MM-DD");
                  const isToday = dateObj.isSame(today, "day");
                  const isPast = dateObj.isBefore(today, "day");
                  const isCurrentMonth = dateObj.month() === currentMonth.month();
                  const dayTasks = tasksByDate[dateStr] || [];
                  const completedTasks = dayTasks.filter(task => task.done).length;
                  const totalTasks = dayTasks.length;

                  return (
                    <div
                      key={dateStr}
                      className={`
                        rounded-xl lg:rounded-2xl border p-2 lg:p-4 min-h-[80px] lg:min-h-[120px] flex flex-col transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                        ${!isCurrentMonth
                          ? "bg-slate-800/20 border-slate-700/20 opacity-40"
                          : isToday
                            ? "bg-gradient-to-br from-emerald-900/40 to-emerald-800/30 border-emerald-500/50 shadow-emerald-500/20 shadow-lg"
                            : isPast
                              ? "bg-slate-700/30 border-slate-600/30"
                              : "bg-slate-700/40 border-slate-600/50 hover:border-emerald-500/30"
                        }
                      `}
                    >
                      {/* Date Header */}
                      <div className="flex items-center justify-between mb-2 lg:mb-3">
                        <div className="flex items-center gap-1 lg:gap-2">
                          <span className={`text-sm lg:text-lg font-bold ${!isCurrentMonth
                              ? "text-slate-500"
                              : isToday
                                ? "text-emerald-300"
                                : isPast
                                  ? "text-slate-400"
                                  : "text-slate-300"
                            }`}>
                            {dateObj.format("D")}
                          </span>
                          {isToday && (
                            <div className="px-1 lg:px-2 py-0.5 lg:py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">
                              <span className="sm:hidden">•</span>
                            </div>
                          )}
                        </div>

                        {/* Task Counter */}
                        {totalTasks > 0 && (
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${completedTasks === totalTasks
                                ? "bg-emerald-400"
                                : completedTasks > 0
                                  ? "bg-yellow-400"
                                  : "bg-slate-400"
                              }`}></div>
                            <span className="text-xs text-slate-400">
                              {completedTasks}/{totalTasks}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tasks List */}
                      <div className="flex-1 overflow-hidden">
                        {dayTasks.length === 0 ? (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-xs text-slate-500 italic hidden lg:block">Tidak ada tugas</span>
                          </div>
                        ) : (
                          <div className="space-y-1 lg:space-y-2 max-h-full overflow-y-auto custom-scrollbar-mini">
                            {dayTasks.map((task, taskIdx) => (
                              <div
                                key={task.id}
                                className={`
                                  group flex items-center justify-between p-1 lg:p-2 rounded-lg transition-all duration-200 hover:scale-[1.02]
                                  ${task.done
                                    ? "bg-emerald-900/20 border border-emerald-700/30"
                                    : "bg-slate-600/30 border border-slate-500/30 hover:border-emerald-500/40"
                                  }
                                `}
                                style={{
                                  animationDelay: `${taskIdx * 50}ms`,
                                  animation: 'slideInUp 0.3s ease-out forwards'
                                }}
                              >
                                <span
                                  className={`text-xs flex-1 truncate ${task.done
                                      ? "line-through text-slate-400"
                                      : "text-slate-200 group-hover:text-emerald-300"
                                    }`}
                                  title={task.title}
                                >
                                  {task.title}
                                </span>

                                <div className="flex items-center gap-0.5 lg:gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    onClick={() => toggleDone(task.id, task.done)}
                                    className={`p-0.5 lg:p-1 rounded-full transition-all duration-200 hover:scale-110 ${task.done
                                        ? "text-emerald-400 hover:bg-emerald-500/20"
                                        : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/20"
                                      }`}
                                    type="button"
                                    title={task.done ? "Tugas selesai" : "Tandai selesai"}
                                  >
                                    <FiCheckCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                                  </button>

                                  {task.done && (
                                    <button
                                      onClick={() => deleteTask(task.id)}
                                      className="p-0.5 lg:p-1 rounded-full text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                                      type="button"
                                      title="Hapus tugas"
                                    >
                                      <FiX className="w-2.5 h-2.5 lg:w-3 lg:h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="mt-6 lg:mt-8 pt-6 lg:pt-8 border-t border-slate-700/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-slate-400 text-sm">
                    {tasks.length > 0 ? (
                      <span>
                        Total {tasks.length} tugas • {tasks.filter(t => t.done).length} selesai
                      </span>
                    ) : (
                      <span>Belum ada tugas yang tercatat</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs lg:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-slate-400">Selesai</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-slate-400">Sebagian</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="text-slate-400">Belum</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <style jsx>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Mini Custom Scrollbar for task lists */
          .custom-scrollbar-mini::-webkit-scrollbar {
            width: 2px;
          }

          .custom-scrollbar-mini::-webkit-scrollbar-track {
            background: rgba(51, 65, 85, 0.2);
            border-radius: 2px;
          }

          .custom-scrollbar-mini::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #10b981, #059669);
            border-radius: 2px;
          }

          .custom-scrollbar-mini::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #059669, #047857);
          }

          /* Firefox */
          .custom-scrollbar-mini {
            scrollbar-width: thin;
            scrollbar-color: #10b981 rgba(51, 65, 85, 0.2);
          }

          @media (max-width: 640px) {
            .custom-scrollbar-mini::-webkit-scrollbar {
              width: 1px;
            }
          }
        `}</style>
      </div>
    </MainLayout>
  );
}