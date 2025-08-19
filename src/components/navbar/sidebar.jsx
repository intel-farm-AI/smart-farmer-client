import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Mock icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export function Sidebar({ isMobile = false, isOpen = true, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <HomeIcon />,
      description: "Ikhtisar & Analisis"
    },
    {
      label: "Harga Pasar",
      to: "/market",
      icon: <TrendingUpIcon />,
      description: "Harga dan Tren Pasar"
    },
    {
      label: "Cek Penyakit",
      to: "/prediction",
      icon: <ActivityIcon />,
      description: "Deteksi Penyakit Tanaman"
    }
  ];

  const handleNavClick = (path) => {
    navigate(path); // 🔥 pindah halaman beneran
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  return (
    <aside
      className="bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 text-white w-72 flex flex-col h-[calc(100vh-64px)] shadow-2xl transition-all duration-300 ease-in-out"
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Navigasi
          </h2>
          <p className="text-xs text-slate-400">
            Atur smart farm Anda dengan mudah
          </p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <li key={item.to}>
                <button
                  onClick={() => handleNavClick(item.to)}
                  className={`group relative flex items-center gap-3 py-3 px-3 rounded-xl font-medium transition-all duration-300 w-full text-left ${
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
                  <span
                    className={`flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? "text-emerald-400 scale-110"
                        : "text-slate-400 group-hover:text-emerald-400 group-hover:scale-105"
                    }`}
                  >
                    {item.icon}
                  </span>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                      {item.description}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600/0 to-emerald-400/0 group-hover:from-emerald-600/5 group-hover:to-emerald-400/5 transition-all duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  ></div>
                </button>
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
      <div className="px-6 pb-4">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-300">
              AI Status
            </span>
          </div>
          <p className="text-xs text-slate-500">All systems operational</p>
        </div>
      </div>
    </aside>
  );
}
