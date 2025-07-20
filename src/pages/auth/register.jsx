import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../../lib/services/firebase";
import { MainLayout } from "../../layout/main";
import { loginWithGoogle } from "../../lib/utils/googleAuth";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Set displayName di Firebase Auth
      await updateProfile(userCredential.user, { displayName: name });

      await set(ref(db, `users/${uid}`), {
        name,
        email,
        createdAt: Date.now(),
      });

      navigate("/dashboard");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout withNavigation={false}>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[90vh] px-6 py-12 bg-gray-50">
        <div className="hidden md:flex md:w-1/2 justify-center">
          <img
            src="/src/assets/images/homepage/register.jpg"
            alt="Register Illustration"
            className="rounded-xl shadow-lg object-cover max-w-full"
          />
        </div>

        <div className="w-full md:w-1/2 max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-green-800 text-center">Daftar Akun</h2>
          <p className="mb-6 text-center text-green-900">Ayo bergabung dengan kami</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Nama Lengkap</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              {loading ? "Mendaftarkan..." : "Daftar"}
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
                  alert("Gagal login dengan Google");
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:shadow-md transition duration-200 text-gray-700"
            >
              <span className="rounded-full p-1 flex items-center justify-center">
                <FcGoogle className="text-lg" />
              </span>
              <span>Daftar dengan Google</span>
            </button>
            <p className="text-gray-500 text-sm mt-2">
                Sudah punya akun?{" "}
                <Link to="/login">
                    Masuk
                </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
