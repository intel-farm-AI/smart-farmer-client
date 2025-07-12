import { useState } from "react";
import { Link } from "react-router-dom";

export function MainLayout({ withNavigation = true, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="bg-lime-800 text-white p-4 w-full flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center w-full">
          <div className="flex items-center w-full md:w-auto justify-between">
            <div className="flex items-center">
              <img src="/src/assets/images/logo/smart-farm.svg" alt="Intel AI Competition Logo" className="inline-block w-8 h-8 mr-2" />
              <span className="text-xl font-bold">Smartfarm AI</span>
            </div>
            {withNavigation && (
              <button
                className="md:hidden block text-white focus:outline-none"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Toggle navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          {withNavigation && (
            <>
              {menuOpen && (
                <div className="fixed inset-0 bg-black/40 z-40 md:hidden animate-fadeIn" onClick={() => setMenuOpen(false)}></div>
              )}
              <nav
                className={`fixed top-0 left-0 h-full w-64 bg-white text-lime-800 z-50 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:static md:bg-transparent md:text-white md:w-auto md:h-auto md:translate-x-0 md:flex md:items-center`}
                style={{ boxShadow: menuOpen ? '2px 0 16px rgba(0,0,0,0.08)' : 'none' }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none md:hidden"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Tutup menu"
                >
                  &times;
                </button>
                <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-16 md:mt-0 items-start md:items-center px-6 md:px-0">
                  <li className="w-full md:w-auto"><Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 md:py-0">Beranda</Link></li>
                  <li className="w-full md:w-auto"><a href="#about" onClick={() => setMenuOpen(false)} className="block py-2 md:py-0">Tentang</a></li>
                  <li className="w-full md:w-auto"><Link to="/contact" onClick={() => setMenuOpen(false)} className="block py-2 md:py-0">Kontak</Link></li>
                  <li className="md:hidden w-full">
                    <Link to="/try-ai" onClick={() => setMenuOpen(false)} className="block bg-lime-700 text-white px-4 py-2 rounded hover:bg-lime-800 text-center mt-4">Getting Started</Link>
                  </li>
                </ul>
              </nav>
              <div className="hidden md:block">
                <button className="bg-white text-lime-800 px-4 py-2 rounded hover:bg-gray-200">
                  <Link to="/try-ai">Mulai Sekarang</Link>
                </button>
              </div>
              {/* Animations */}
              <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fadeIn { animation: fadeIn 0.2s ease; }
              `}</style>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-lime-800 text-white text-center p-4">
        <p>&copy; 2023 Intel AI Competition</p>
      </footer>
    </>
  );
}