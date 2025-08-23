import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../lib/services/firebase";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";

export function Header({ withNavigation }) {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  let avatarUrl = null;
  let displayNameShort = null;

  if (user) {
    let displayName = user.displayName || "";
    let nameParts = displayName.trim().split(/\s+/).slice(0, 2);
    displayNameShort = nameParts.join(" ") || user.email || "Undefined";
    let nameForAvatar = nameParts.join("+") || (user.email || "User");

    avatarUrl =
      user.photoURL ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        nameForAvatar
      )}&background=10b981&color=fff&size=64&bold=true`;
  }

  // Close dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50 text-white w-full fixed top-0 z-50 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center px-6 h-16">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-white hover:scale-105 transition-all duration-300 group"
        >
          <div className="relative">
            <img
              src="/src/assets/images/logo/smart-farm.svg"
              alt="Smartfarm AI Logo"
              className="w-9 h-9 drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
            />
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
            Smartfarm{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent font-extrabold">
              AI
            </span>
          </span>
        </Link>

        {/* Navigation + User */}
        {user ? (
          <div className="flex items-center gap-6 relative" ref={dropdownRef}>
            {withNavigation && (
              <Link
                to="/dashboard"
                className="hidden sm:inline-block relative text-sm md:text-base font-semibold text-slate-300 hover:text-emerald-300 transition-all duration-300 group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-emerald-300 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}

            {/* Avatar button */}
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="relative rounded-full focus:outline-none ring-2 ring-transparent hover:ring-emerald-400/60 focus:ring-emerald-400/60 transition-all duration-300 group"
            >
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={displayNameShort}
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-700 group-hover:border-emerald-400/60 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-55 w-52 bg-slate-800/95 backdrop-blur-xl text-white rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden animate-slideIn">
                <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatarUrl}
                      alt={displayNameShort}
                      className="w-10 h-10 rounded-full border-2 border-emerald-400/30"
                    />
                    <div>
                      <p className="text-sm font-bold text-white">{displayNameShort}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[8rem]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="py-2">                 
                  <div className="border-t border-slate-700/50 mt-2 pt-2">
                    <button
                      className="flex items-center gap-3 w-full px-5 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                      onClick={async () => {
                        setShowDropdown(false);
                        const auth = getAuth(app);
                        await signOut(auth);
                      }}
                    >
                      <FiLogOut className="text-base group-hover:text-red-300 transition-colors duration-200" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          withNavigation && (
            <Link
              to="/login"
              className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Mulai Sekarang</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          )
        )}
      </div>

      {/* Enhanced Animations */}
      <style>{`
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(-12px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        /* Glassmorphism effect */
        .backdrop-blur-xl {
          backdrop-filter: blur(20px);
        }
        
        /* Gradient text support */
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </header>
  );
}