import { Link } from "react-router-dom";

export function Header({ withNavigation }) {
  return (
    <header className="bg-lime-800 text-white w-full sticky top-0 z-50 shadow">
      <div className="container mx-auto flex flex-row justify-between items-center py-3 px-4">
        <Link to="/" className="flex items-center gap-3 text-white hover:opacity-90">
          <img
            src="/src/assets/images/logo/smart-farm.svg"
            alt="Smartfarm AI Logo"
            className="w-10 h-10"
          />
          <span className="text-2xl font-extrabold tracking-tight drop-shadow">Smartfarm AI</span>
        </Link>
        {withNavigation && (
          <Link
            to="/login"
            className="bg-white text-lime-800 px-5 py-2 rounded-lg font-semibold shadow hover:bg-lime-100 transition-all ml-4"
          >
            Mulai Sekarang
          </Link>
        )}
      </div>
    </header>
  );
}