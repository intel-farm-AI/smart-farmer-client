import { useNavigate } from "react-router-dom";
import { MainLayout } from "../layout/main";
import { team } from "../lib/utils/developerTeam";


export default function About() {
    const navigate = useNavigate();
  return (
    <MainLayout>
      <div className="relative min-h-[90vh] w-full text-center bg-gray-50 py-8 px-2 flex flex-col items-center justify-center">
        {/* Tombol Kembali di pojok kiri atas */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute top-6 left-4 flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded transition-colors shadow bg-white"
          style={{zIndex: 10}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>
        <h1 className="text-4xl font-bold mb-2 mt-8">Mengenal Tim Kami</h1>
        <p className="mb-8 text-lg text-gray-600 max-w-xl mx-auto">Kami adalah tim yang berdedikasi untuk mengembangkan solusi AI untuk pertanian.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center w-full max-w-5xl px-2">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-xs mx-auto">
              <img
                src={member.photo}
                alt={member.name}
                className="w-28 h-28 rounded-full object-cover border-4 border-green-200 shadow mb-4"
              />
              <div className="text-xl font-semibold text-gray-800">{member.name}</div>
              <div className="text-xs text-gray-500 mb-2">{member.role}</div>
              <div className="flex gap-4 mt-2">
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black" title="GitHub">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.75.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.7.42.36.79 1.09.79 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.21.68.8.56C20.71 21.39 24 17.08 24 12c0-6.27-5.23-11.5-12-11.5z"/></svg>
                </a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900" title="LinkedIn">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}