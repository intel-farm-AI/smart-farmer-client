import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiActivity,  FiChevronLeft, FiChevronRight, FiHome, FiSettings, FiTrendingUp } from "react-icons/fi";

export function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(true);

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: <FiHome /> },
  { label: "Harga Pasar", to: "/market", icon: <FiTrendingUp /> },
  { label: "Cek Penyakit", to: "/prediction", icon: <FiActivity /> },
  { label: "Pengaturan", to: "#", icon: <FiSettings /> }, 
];

  return (
    <aside
      className={`bg-green-900 text-white ${open ? "w-56" : "w-16"} flex flex-col pt-4 h-[calc(100vh-64px)] sticky top-[64px] shadow-lg transition-all duration-200`}
      aria-label="Sidebar"
    >
      <button
        className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded hover:bg-green-800 transition"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup sidebar" : "Buka sidebar"}
      >
        {open ? <FiChevronLeft size={22} /> : <FiChevronRight size={22} />}
      </button>
      <nav className="flex-1">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 py-2 px-2 rounded-lg font-medium transition ${
                  location.pathname.startsWith(item.to)
                    ? "bg-green-700"
                    : "hover:bg-green-800"
                }`}
              >
                <span>{item.icon}</span>
                {open && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}