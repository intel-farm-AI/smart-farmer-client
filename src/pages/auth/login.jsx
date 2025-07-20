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
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[90vh] px-6 py-12 bg-gray-50">
        <div className="hidden md:flex md:w-1/2 justify-center">
          <img
            src="/src/assets/images/homepage/login.jpg"
            alt="Login Illustration"
            className="rounded-xl shadow-lg object-cover max-w-full"
          />
        </div>

        <div className="w-full md:w-1/2 max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-green-800 text-center">Login Akun</h2>
          <p className="mb-6 text-center text-green-900">Masuk untuk melanjutkan</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
              disabled={loading}
            >
              {loading ? "Masuk..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-2">atau</p>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md transition duration-200 text-gray-700"
            >
              <FcGoogle className="text-lg" />
              <span>Login dengan Google</span>
            </button>
            <p className="text-gray-500 text-sm mt-2">
              Belum punya akun?{" "}
              <Link to="/register" className="text-green-700 hover:underline">
                Daftar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}