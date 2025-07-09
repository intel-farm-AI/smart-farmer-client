import { useState } from "react";
import { Link } from "react-router-dom";

export function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <header className="bg-lime-800 text-white p-4 w-screen flex flex-col md:flex-row justify-between items-center sticky top-0 z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center w-full">
          <div className="flex items-center w-full md:w-auto justify-between">
            <div className="flex items-center">
              <img src="/src/assets/images/logo/favicon.ico" alt="Intel AI Competition Logo" className="inline-block w-8 h-8 mr-2" />
              <span className="text-xl font-bold">Smartfarm AI</span>
            </div>
            <button
              className="md:hidden block text-white focus:outline-none"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <nav
            className={`w-full md:w-auto ${menuOpen ? "block" : "hidden"} md:block`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 mt-4 md:mt-0 items-center">
              <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
              <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
              <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
              <li className="md:hidden">
                <button className="bg-white text-lime-800 px-4 py-2 rounded hover:bg-gray-200 w-full">
                  <Link to="/login" onClick={() => setMenuOpen(false)}>Getting Started</Link>
                </button>
              </li>
            </ul>
          </nav>
          <div className="hidden md:block">
            <button className="bg-white text-lime-800 px-4 py-2 rounded hover:bg-gray-200">
              <Link to="/login">Getting Started</Link>
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="bg-lime-800 text-white text-center p-4 mt-4">
        <p>&copy; 2023 Intel AI Competition</p>
      </footer>
    </>
  );
}