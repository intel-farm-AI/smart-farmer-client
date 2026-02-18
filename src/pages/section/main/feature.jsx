import { useState, useEffect } from "react";
import {
  FaStethoscope,
  FaLeaf,
  FaCloudSun,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";
import {
  IoSparkles,
  IoFlash
} from "react-icons/io5";
import { HiSparkles } from "react-icons/hi";

export function Feature() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: FaStethoscope,
      title: "Deteksi Penyakit Otomatis",
      description: "Unggah foto tanaman, AI akan mendeteksi penyakit dan memberikan solusi penanganan.",
      color: "from-red-500/80 to-pink-500/80",
      glowColor: "shadow-red-500/25"
    },
    {
      icon: FaLeaf,
      title: "Rekomendasi Perawatan",
      description: "Dapatkan tips perawatan, pemupukan, dan penyiraman yang sesuai dengan kondisi tanaman Anda.",
      color: "from-green-500/80 to-emerald-500/80",
      glowColor: "shadow-green-500/25"
    },
    {
      icon: FaCloudSun,
      title: "Perkiraan Cuaca",
      description: "Pantau prakiraan cuaca terkini untuk mendukung aktivitas pertanian Anda.",
      color: "from-blue-500/80 to-cyan-500/80",
      glowColor: "shadow-blue-500/25"
    }
  ];

  return (
    <section className="py-20 bg-slate-900 overflow-hidden relative">

      <div className="container mx-auto px-6 relative z-10">

        {/* Header Section */}
        <div className="text-center mb-16">

          {/* Main Title with Glass Effect */}
          <div className="relative">
            <h2 className="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-blue-200 leading-tight mb-6">
              Fitur <span className="text-green-400">Unggulan</span>
            </h2>

            {/* Title Glow Effect */}
            <div className="absolute inset-0 text-5xl lg:text-6xl font-black leading-tight mb-6 -z-10">
              Fitur Unggulan
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Teknologi AI terdepan yang mengubah cara Anda bertani dengan
            <span className="text-green-400 font-semibold"> efisiensi maksimal</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >

                {/* Glass Card */}
                <div className={`relative h-full p-8 rounded-3xl transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2
                  bg-white/10 backdrop-blur-lg border border-white/20 
                  shadow-xl ${hoveredCard === index ? feature.glowColor + ' shadow-2xl' : ''}
                  hover:bg-white/15 hover:border-white/30`}>

                  {/* Card Glow Background */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${feature.color} blur-xl -z-10`}></div>

                  {/* Floating Icon Container */}
                  <div className="relative mb-3">
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-sm p-5 
                      shadow-lg border border-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500
                      relative overflow-hidden`}>

                      {/* Icon Shine Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                      <IconComponent className="w-full h-full text-white relative z-10" />
                    </div>

                    {/* Icon Reflection */}
                    <div className={`w-20 h-10 mx-auto mt-1 rounded-full bg-gradient-to-br ${feature.color} opacity-20 blur-md`}></div>
                  </div>

                  {/* Content */}
                  <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-green-300 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}