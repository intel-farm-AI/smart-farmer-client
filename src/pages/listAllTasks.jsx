import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { MainLayout } from "../layout/main";
import { db } from "../lib/services/firebase";
import { useNavigate } from "react-router-dom";

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

  const today = dayjs();
  const WEEKS_TO_SHOW = 4;
  const startOfCalendar = today.startOf("isoWeek");
  const daysOfCalendar = Array.from({ length: 7 * WEEKS_TO_SHOW }, (_, i) =>
    startOfCalendar.add(i, "day")
  );

  return (
    <MainLayout withNavigation={false}>
      <section className="container mx-auto my-8 p-6 bg-white rounded-2xl shadow-md">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium px-3 py-2 rounded transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Kalender Tugas</h2>

        {loading ? (
          <p className="text-center text-gray-500">Memuat tugas...</p>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-4">
              {daysOfCalendar.map((dateObj, idx) => {
                const dateStr = dateObj.format("YYYY-MM-DD");
                const dayLabel = dateObj.format("dd");
                const isToday = dateObj.isSame(today, "day");
                const dayTasks = tasksByDate[dateStr] || [];
                const isFirstRow = idx < 7;

                return (
                  <div
                    key={dateStr}
                    className={`rounded-xl border p-2 min-h-[120px] flex flex-col bg-gray-50 ${
                      isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"
                    } ${isFirstRow ? "" : "border-t-4 border-t-gray-300"}`}
                  >
                    <div
                      className={`flex items-center gap-1 mb-2 ${
                        isToday
                          ? "text-blue-600 font-bold"
                          : "text-gray-700 font-semibold"
                      }`}
                    >
                      <span>{dayLabel}</span>
                      <span className="text-xs">{dateObj.format("D")}</span>
                      {isToday && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-100 text-xs rounded">
                          Hari Ini
                        </span>
                      )}
                    </div>

                    {dayTasks.length === 0 ? (
                      <span className="text-xs text-gray-400">Tidak ada tugas</span>
                    ) : (
                      <ul className="space-y-1">
                        {dayTasks.map((task) => (
                          <li
                            key={task.id}
                            className="flex items-center justify-between group"
                          >
                            <span
                              className={`text-xs truncate ${
                                task.done
                                  ? "line-through text-gray-400"
                                  : "text-gray-800 font-medium"
                              }`}
                            >
                              {task.title}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => toggleDone(task.id, task.done)}
                                className="p-0.5 rounded-full hover:bg-green-100 focus:outline-none"
                                type="button"
                                title={task.done ? "Tugas selesai" : "Tandai selesai"}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className={`w-4 h-4 ${
                                    task.done ? "text-green-500" : "text-gray-400"
                                  }`}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                              </button>

                              {task.done && (
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-0.5 rounded-full hover:bg-red-100 focus:outline-none"
                                  type="button"
                                  title="Hapus tugas"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-4 h-4 text-red-500"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            {tasks.length === 0 && (
              <p className="text-gray-500 mt-8 text-center">
                Belum ada tugas yang tercatat.
              </p>
            )}
          </>
        )}
      </section>
    </MainLayout>
  );
}