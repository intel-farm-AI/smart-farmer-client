import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiMail, FiHeart, FiAward } from "react-icons/fi";

export function Footer() {
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Bottom Bar */}
        <div className="border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              
              {/* Copyright */}
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <span>&copy; 2025 Smartfarm AI</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">All rights reserved</span>
              </div>

              {/* Competition Badge */}
              <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <FiAward className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 text-sm font-semibold">
                  Intel AI Competition
                </span>
                <span className="text-slate-400 text-sm">by</span>
                <span className="text-white font-bold text-sm">Agrify Team</span>
              </div>

              {/* Kirim Laporan */}
              <Link
                to="/report"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-semibold border border-emerald-500/30 rounded-full px-4 py-2 transition-colors duration-200"
              >
                <FiMail className="w-4 h-4" />
                Kirim Laporan
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
      `}</style>
    </footer>
  );
}