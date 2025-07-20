import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../lib/services/firebase";
import { FiLogOut } from "react-icons/fi";

export function Header({ withNavigation }) {
  const [user, setUser] = useState(null);

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
    
    // Ambil hanya dua kata pertama
    let nameParts = displayName.trim().split(/\s+/).slice(0, 2);
    displayNameShort = nameParts.join(" ") || user.email || "Undefined";
    let nameForAvatar = nameParts.join("+") || (user.email || "User");
    
    avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(nameForAvatar)}&background=8bc34a&color=fff&size=64`;
  } 

  // Dropdown state for logout
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="bg-green-800 text-white w-full sticky top-0 z-50 shadow">
      <div className="container mx-auto flex flex-row justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90">
          <img
            src="/src/assets/images/logo/smart-farm.svg"
            alt="Smartfarm AI Logo"
            className="w-10 h-10"
          />
          <span className="text-2xl font-extrabold tracking-tight drop-shadow">Smartfarm AI</span>
        </Link>
        {user ? (
          <div className="flex items-center gap-2 ml-4 relative" ref={dropdownRef}>
            {withNavigation && (
              <Link to="/dashboard" className="text-white hover:opacity-90 transition text-base font-medium">
                Dashboard
              </Link>
            )}
            <button
              className="focus:outline-none"
              onClick={() => setShowDropdown((v) => !v)}
              aria-haspopup="true"
              aria-expanded={showDropdown}
              style={{ background: 'none', padding: 0, border: 'none' }}
            >
              <img
                src={avatarUrl}
                alt={displayNameShort}
                className="w-8 h-8 rounded-full object-cover border border-green-200"
              />
            </button>
            {showDropdown && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fadeIn"
                   style={{ minWidth: '11rem' }}>
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-semibold transition"
                  onClick={async () => {
                    setShowDropdown(false);
                    const auth = getAuth(app);
                    await signOut(auth);
                  }}
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            )}
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px);} to { opacity: 1; transform: translateY(0);} }
              .animate-fadeIn { animation: fadeIn 0.18s cubic-bezier(.4,1.4,.6,1) forwards; }
            `}</style>
          </div>
        ) : (
          withNavigation && (
            <Link
              to="/login"
              className="bg-white text-green-800 px-5 py-2 rounded-lg font-semibold shadow hover:bg-green-100 transition-all ml-4"
            >
              Mulai Sekarang
            </Link>
          )
        )}
      </div>
    </header>
  );
}