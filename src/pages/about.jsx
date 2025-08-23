import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layout/main";
import { team } from "../lib/utils/developerTeam";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function About() {
    const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="relative min-h-[90vh] w-full text-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 mt-15 px-2 flex flex-col items-center justify-center">
        {/* Tombol Kembali di pojok kiri atas */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute cursor-pointer top-6 left-4 flex items-center gap-2 text-slate-300 hover:text-emerald-400 font-medium px-4 py-2.5 rounded-lg transition-all duration-300 shadow-lg bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-emerald-500/20"
          style={{zIndex: 10}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>

        {/* Header Section */}
        <div className="mt-8 mb-12 max-w-4xl mx-auto">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Mengenal Tim Agrify
            </h1>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg blur opacity-20"></div>
          </div>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Kami adalah tim yang berdedikasi untuk mengembangkan solusi AI inovatif dalam bidang pertanian modern.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center w-full max-w-6xl px-4">
          {team.map((member, index) => (
            <div 
              key={member.name} 
              className="group relative bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-8 flex flex-col items-center w-full max-w-sm mx-auto border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-emerald-500/10 hover:shadow-2xl hover:scale-105"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Gradient overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-slate-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Profile Image */}
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                <img
                  src={member.photo}
                  alt={member.name}
                  className="relative w-32 h-32 rounded-full object-cover border-2 border-emerald-400/30 shadow-xl group-hover:border-emerald-400/60 transition-all duration-500"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Member Info */}
              <div className="relative z-10 text-center">
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-sm text-slate-400 mb-6 font-medium tracking-wide">
                  {member.role}
                </p>

                {/* Social Links */}
                <div className="flex gap-4 justify-center">
                  <a 
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-full bg-slate-700/50 text-slate-300 hover:text-slate-100 hover:bg-slate-600/60 border border-slate-600/50 hover:border-slate-500 transition-all duration-300 hover:scale-110 hover:shadow-lg group/link"
                    title="GitHub"
                  >
                    <FaGithub size={20} className="group-hover/link:scale-110 transition-transform duration-300" />
                  </a>
                  <a 
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-full bg-slate-700/50 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/30 border border-slate-600/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/20 group/link"
                    title="LinkedIn"
                  >
                    <FaLinkedin size={20} className="group-hover/link:scale-110 transition-transform duration-300" />
                  </a>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-emerald-400 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-600/3 to-slate-700/3 rounded-full blur-3xl"></div>
      </div>
    </MainLayout>
  );
}