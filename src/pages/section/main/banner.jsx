// import { Link } from "react-router-dom"; // Commented out for demo
import { useState, useEffect } from "react";
import { 
  FaChevronRight, 
  FaStar, 
  FaShieldAlt, 
  FaBolt,
  FaLeaf,
  FaSeedling,
  FaRobot,
  FaChartLine,
  FaEye
} from "react-icons/fa";
import { 
  HiSparkles, 
} from "react-icons/hi";
import { 
  IoSparkles,
  IoFlash,
} from "react-icons/io5";

export function Banner() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl "></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0),
              radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2px, transparent 0)
            `,
            backgroundSize: '100px 100px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[80vh]">
          
          {/* Content Section */}
          <div className={`lg:w-1/2 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>

            {/* Main Heading */}
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-emerald-400 leading-tight mb-5">
              Smart<span className="text-green-400">farm</span>
              <br />
              <span className="text-4xl lg:text-5xl xl:text-6xl bg-gradient-to-r from-green-300 to-emerald-500 bg-clip-text">AI Revolution</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl">
              Transformasi digital untuk <span className="text-green-400 font-semibold">pertanian masa depan</span>. 
              Deteksi penyakit real-time, optimalisasi hasil panen, dan analisis prediktif yang akurat.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4 mb-12">
              <div className="flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                <FaShieldAlt className="w-4 h-4 mr-2 text-blue-400" />
                Akurasi 99.2%
              </div>
              <div className="flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                <FaRobot className="w-4 h-4 mr-2 text-purple-400" />
                AI Powered
              </div>
              <div className="flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm">
                <FaLeaf className="w-4 h-4 mr-2 text-green-400" />
                Eco Friendly
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <a href="/login">
                <button className="group cursor-pointer relative px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Mulai Gratis Sekarang
                    <FaChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className={`lg:w-1/2 transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="relative" style={parallaxStyle}>
              
              {/* Main Image Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl rotate-6 group-hover:rotate-3 transition-transform duration-500 opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl -rotate-6 group-hover:-rotate-3 transition-transform duration-500 opacity-20"></div>
                
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-2 shadow-2xl border border-white/20 group-hover:shadow-green-500/20 transition-all duration-500">
                  <img 
                    src="/src/assets/images/homepage/homepage.jpg" 
                    alt="SmartFarm AI Dashboard" 
                    draggable="false" 
                    className="w-full h-auto rounded-2xl shadow-xl group-hover:scale-105 transition-transform duration-500 select-none"
                  />
                  
                  {/* Floating Stats Cards */}
                  <div className="absolute -top-4 -left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <FaChartLine className="w-4 h-4" />
                    <div>
                      <div className="text-sm font-bold">+85%</div>
                      <div className="text-xs opacity-90">Produktivitas</div>
                    </div>
                  </div>
                  
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                    <FaEye className="w-4 h-4" />
                    <div>
                      <div className="text-sm font-bold">24/7</div>
                      <div className="text-xs opacity-90">Diseases Detection</div>
                    </div>
                  </div>

                  <div className="absolute top-1/3 -left-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
                    <FaSeedling className="w-3 h-3" />
                    <div>
                      <div className="text-xs font-bold">Smart</div>
                      <div className="text-xs opacity-90">Growth</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-green-400/30 rounded-full flex items-center justify-center">
                <HiSparkles className="w-8 h-8 text-green-300" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-emerald-400/30 rounded-full flex items-center justify-center">
                <IoFlash className="w-6 h-6 text-emerald-300" />
              </div>
              <div className="absolute top-1/2 -right-12 w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                <FaStar className="w-4 h-4 text-blue-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-30 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </section>
  );
}