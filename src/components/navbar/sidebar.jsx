import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiTrendingUp,
} from "react-icons/fi";

export function Sidebar({ isMobile = false, isOpen = true, onToggle }) {
  const location = useLocation();
  const [open, setOpen] = useState(!isMobile);

  const navItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <FiHome />,
      description: "Ikhtisar & Analisis"
    },
    {
      label: "Harga Pasar",
      to: "/market",
      icon: <FiTrendingUp />,
      description: "Harga dan Tren Pasar"
    },
    {
      label: "Cek Penyakit",
      to: "/prediction",
      icon: <FiActivity />,
      description: "Deteksi Penyakit Tanaman"
    }
  ];

  useEffect(() => {
    if (isMobile) {
      setOpen(isOpen);
    }
  }, [isMobile, isOpen]);

  const handleToggle = () => {
    if (isMobile && onToggle) {
      onToggle();
    } else {
      setOpen((v) => !v);
    }
  };

  const handleNavClick = () => {
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  return (
    <aside
      className={`bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 text-white ${
        open ? "w-72" : "w-16"
      } flex flex-col h-[calc(100vh-64px)] shadow-2xl transition-all duration-300 ease-in-out overflow-hidden`}
      aria-label="Sidebar"
    >
      {/* Toggle Button */}
      <div className="relative">
        <button
          className={`absolute ${open ? 'right-4' : 'right-2'} top-4 z-10 flex items-center justify-center w-8 h-8 bg-slate-800 hover:bg-emerald-600 rounded-full transition-all duration-300 hover:scale-110 group border border-slate-700/50 hover:border-emerald-500/50 ${isMobile ? 'hidden' : ''}`}
          onClick={handleToggle}
          aria-label={open ? "Tutup sidebar" : "Buka sidebar"}
        >
          {open ? (
            <FiChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          ) : (
            <FiChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className={`${open ? 'px-6' : 'px-3'} pt-6 pb-4`}>
        {open ? (
          <div className="space-y-1">
            <h2 className="text-lg font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              Navigasi
            </h2>
            <p className="text-xs text-slate-400">
              Atur smart farm Anda dengan mudah
            </p>
          </div>
        ) : (
          <div className="w-6 h-6"></div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={handleNavClick}
                  className={`group relative flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent hover:border-slate-700/50"
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-r-full"></div>
                  )}

                  {/* Icon */}
                  <span className={`flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? "text-emerald-400 scale-110"
                      : "text-slate-400 group-hover:text-emerald-400 group-hover:scale-105"
                  }`}>
                    {item.icon}
                  </span>

                  {/* Text Content */}
                  {open && (
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">
                        {item.label}
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        {item.description}
                      </div>
                    </div>
                  )}

                  {/* Hover glow effect */}
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600/0 to-emerald-400/0 group-hover:from-emerald-600/5 group-hover:to-emerald-400/5 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="px-6 py-2">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
      </div>

      {/* Footer Badge */}
      {open && (
        <div className="px-6 pb-4">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-300">
                AI Status
              </span>
            </div>
            <p className="text-xs text-slate-500">
              All systems operational
            </p>
          </div>
        </div>
      )}

      <style>{`
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </aside>
  );
}