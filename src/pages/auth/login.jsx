import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/services/firebase";
import { MainLayout } from "../../layout/main";
import { loginWithGoogle } from "../../lib/utils/googleAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError("Email atau password salah");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout withNavigation={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Sisi Kiri - Ilustrasi */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-400/20 rounded-3xl blur-3xl"></div>
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <img
                src="/assets/images/homepage/login.jpg"
                alt="Ilustrasi Masuk"
                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* Sisi Kanan - Formulir Login */}
          <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
              {/* Kartu Glassmorphism */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang Kembali</h2>
                  <p className="text-slate-300">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {/* Formulir Login */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="nama@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-200 mb-2">
                        Kata Sandi
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="Masukkan kata sandi Anda"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                      <p className="text-red-300 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      "Masuk"
                    )}
                  </button>
                </form>

                {/* Pembatas */}
                <div className="my-6 flex items-center">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                  <span className="px-4 text-slate-400 text-sm">atau</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
                </div>

                {/* Login dengan Google */}
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await loginWithGoogle();
                      navigate("/dashboard");
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <FcGoogle className="text-xl" />
                  <span>Lanjutkan dengan Google</span>
                </button>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-slate-300 text-sm">
                    Belum punya akun?{" "}
                    <Link
                      to="/register"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors duration-200"
                    >
                      Daftar sekarang
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}