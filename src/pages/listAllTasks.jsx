import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { MainLayout } from "../layout/main";
import { db } from "../lib/services/firebase";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useNavigate } from "react-router-dom";
dayjs.extend(isoWeek);

export default function ListAllTasks() {
  const [tasks, setTasks] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const tasksRef = ref(db, `tasks/${user.uid}`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data).map(([id, value]) => ({ id, ...value }));
        setTasks(taskList);
      } else {
        setTasks([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const toggleDone = (taskId, currentStatus) => {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    update(taskRef, { done: !currentStatus });
  };

  const deleteTask = (taskId) => {
    const taskRef = ref(db, `tasks/${user.uid}/${taskId}`);
    remove(taskRef);
  };

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    if (!task.date) return acc;
    if (!acc[task.date]) acc[task.date] = [];
    acc[task.date].push(task);
    return acc;
  }, {});

  // Get all unique dates and sort ascending
  const allDates = Object.keys(tasksByDate).sort();

  // Calendar grid: show multiple weeks (default: 4 weeks from this week)
  const today = dayjs();
  const WEEKS_TO_SHOW = 4;
  const startOfCalendar = today.startOf('isoWeek');
  const daysOfCalendar = Array.from({ length: 7 * WEEKS_TO_SHOW }, (_, i) => startOfCalendar.add(i, 'day'));
  const navigate = useNavigate();

  return (
    <MainLayout withNavigation={false}>
      <section className="container mx-auto my-8 p-6 bg-white rounded-2xl shadow-md ">
        {/* Tombol Kembali */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-8 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Kalender Tugas</h2>
        <div className="grid grid-cols-7 gap-4">
          {daysOfCalendar.map((dateObj, idx) => {
            const dateStr = dateObj.format('YYYY-MM-DD');
            const dayLabel = dateObj.format('dd');
            const isToday = dateObj.isSame(today, 'day');
            const dayTasks = tasksByDate[dateStr] || [];
            // Tambahkan border top untuk minggu baru
            const isFirstRow = idx < 7;
            return (
              <div
                key={dateStr}
                className={`rounded-xl border p-2 min-h-[120px] flex flex-col bg-gray-50 ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${isFirstRow ? '' : 'border-t-4 border-t-gray-300'}`}
              >
                <div className={`flex items-center gap-1 mb-2 ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700 font-semibold'}`}>
                  <span>{dayLabel}</span>
                  <span className="text-xs">{dateObj.format('D')}</span>
                  {isToday && <span className="ml-1 px-2 py-0.5 bg-blue-100 text-xs rounded">Hari Ini</span>}
                </div>
                {dayTasks.length === 0 ? (
                  <span className="text-xs text-gray-400">Tidak ada tugas</span>
                ) : (
                  <ul className="space-y-1">
                    {dayTasks.map((task) => (
                      <li key={task.id} className="flex items-center justify-between group">
                        <span className={`text-xs truncate ${task.done ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>{task.title}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleDone(task.id, task.done)}
                            className="p-0.5 rounded-full hover:bg-green-100 focus:outline-none"
                            type="button"
                            title={task.done ? 'Tugas selesai' : 'Tandai selesai'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-4 h-4 ${task.done ? 'text-green-500' : 'text-gray-400'}`}> <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /> </svg>
                          </button>
                          {task.done && (
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-0.5 rounded-full hover:bg-red-100 focus:outline-none"
                              type="button"
                              title="Hapus tugas"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-red-500"> <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg>
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
          <p className="text-gray-500 mt-8 text-center">Belum ada tugas yang tercatat.</p>
        )}
      </section>
    </MainLayout>
  );
}