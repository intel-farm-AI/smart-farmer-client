import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ref, onValue, update, remove } from "firebase/database";
import { getAuth } from "firebase/auth";
import { db } from "../../../lib/services/firebase";
import TaskFormModal from "../../../components/modal/taskFormModal";

export default function Task() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // ⬅️ kontrol modal
  const auth = getAuth();
  const user = auth.currentUser;

  // ✅ Format tanggal ke bentuk "20 Juli 2025"
  const formatTanggalIndo = (tanggal) => {
    const bulanIndo = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const hari = tanggal.getDate();
    const bulan = bulanIndo[tanggal.getMonth()];
    const tahun = tanggal.getFullYear();
    return `${hari} ${bulan} ${tahun}`;
  };

  const today = new Date();
  const todayStr = formatTanggalIndo(today);

  useEffect(() => {
    if (!user) return;
    const tasksRef = ref(db, `tasks/${user.uid}`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const taskList = Object.entries(data)
          .map(([id, value]) => ({ id, ...value }))
          .filter((task) => task.date === todayStr); // ⬅️ cocokkan dengan format tanggal Firebase
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

  return (
    <section className="w-full h-[420px] flex flex-col justify-between bg-white rounded-2xl shadow p-6">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tugas Anda Hari Ini</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium px-3 py-1.5 rounded-md text-sm transition-all duration-200 focus:outline-none"
            type="button"
          >
            <span className="text-lg">+</span>{" "}
            <span className="sr-only">Tambah Tugas</span>
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[260px]">
            <p className="text-gray-500">Belum ada tugas hari ini.</p>
          </div>
        ) : (
          <ul className="space-y-4 max-h-[260px] overflow-y-auto scroll-smooth pr-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                  task.done
                    ? "bg-green-50 border-green-300"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <span
                  className={`text-base ${
                    task.done
                      ? "line-through text-gray-400"
                      : "text-gray-800 font-medium"
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleDone(task.id, task.done)}
                    className="p-1 rounded-full hover:bg-green-100 focus:outline-none transition-colors"
                    type="button"
                    title={task.done ? "Tugas selesai" : "Tandai selesai"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className={`w-5 h-5 ${task.done ? "text-green-500" : "text-gray-500"}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </button>
                  {task.done && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 rounded-full hover:bg-red-100 focus:outline-none transition-colors"
                      type="button"
                      title="Hapus tugas"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-gray-500 text-end mt-4">
        <Link to="/dashboard/listTasks" className="text-blue-600 hover:underline">
          Lihat Semua Tugas
        </Link>
      </p>

      {/* Modal muncul di sini */}
      {isModalOpen && <TaskFormModal onClose={() => setIsModalOpen(false)} />}
    </section>
  );
}