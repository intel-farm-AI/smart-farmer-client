import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, push } from "firebase/database"; 
import { getAuth } from "firebase/auth";
import { db } from "../lib/services/firebase";
import { MainLayout } from "../layout/main";

export default function TaskForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul tugas tidak boleh kosong.");
      return;
    }
    if (!date) {
      setError("Tanggal tugas wajib diisi.");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("Pengguna belum login.");
      return;
    }

    const taskData = {
      title,
      date,
      done: false
    };

    try {
      await push(ref(db, `tasks/${user.uid}`), taskData); // ⬅️ simpan ke Firebase
      setTitle("");
      setDate("");
      setError("");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Gagal menyimpan tugas:", err);
      setError("Terjadi kesalahan saat menyimpan tugas.");
    }
  };

  return (
    <MainLayout withNavigation={false}>
      <section className="relative flex items-center justify-center min-h-[90vh]">
        <div className="w-full max-w-3xl p-8 bg-white rounded-2xl shadow-md">
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

          <h1 className="text-2xl font-bold mb-6 text-gray-800">Tambah Tugas Baru</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul Tugas
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Menyiram tanaman"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Tugas
              </label>
              <input
                id="date"
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Tambah Tugas
            </button>
          </form>

          {showToast && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
              Tugas berhasil ditambahkan!
            </div>
          )}

          <style>
            {`
              @keyframes slideIn {
                0% { transform: translate(-50%, 30px); opacity: 0; }
                100% { transform: translate(-50%, 0); opacity: 1; }
              }
              .animate-slide-in {
                animation: slideIn 0.3s ease-out;
              }
            `}
          </style>
        </div>
      </section>
    </MainLayout>
  );
}
