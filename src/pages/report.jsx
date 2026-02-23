import { useState } from "react";
import { MainLayout } from "../layout/main";
import { sendReportEmail } from "../lib/services/emailjs"; // service kirim email

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendReportEmail(formData);

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("EmailJS Error:", err);
      setError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">
        <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-3">
            Hubungi Kami
          </h2>
          <p className="text-slate-300 text-center mb-2">
            Form ini akan mengirimkan email langsung ke tim kami.
          </p>
          <p className="text-slate-300 text-center mb-8">
            Punya pertanyaan, masukan, atau laporan?
            Silakan isi form di bawah ini 📩
          </p>

          {success && (
            <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 animate-fade-in">
              <p className="text-emerald-300 font-semibold">
                ✅ Pesan berhasil dikirim ke tim kami melalui email!
              </p>
              <p className="text-emerald-200 text-sm">
                Kami akan merespons secepatnya (24-48 jam). Pastikan email Anda aktif untuk menerima balasan.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Nama Lengkap *"
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Email *"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Subjek Pesan *"
                required
              />
            </div>
            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                placeholder="Tuliskan pesan Anda *"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}