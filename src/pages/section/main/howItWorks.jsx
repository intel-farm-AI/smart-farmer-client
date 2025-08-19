import { useState, useEffect } from "react";
import { 
  FaUpload,
  FaBrain,
  FaLightbulb,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

export function HowItWorks() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('howitworks-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      number: "01",
      icon: FaUpload,
      title: "Upload Foto",
      description: "Unggah foto tanaman yang ingin dianalisis dengan mudah melalui smartphone atau kamera",
      detail: "Cukup ambil foto dengan resolusi minimal 720p untuk hasil analisis yang optimal",
      gradientFrom: "from-blue-400",
      gradientTo: "to-cyan-400",
      glowColor: "blue-400/30"
    },
    {
      number: "02", 
      icon: FaBrain,
      title: "AI Analysis",
      description: "AI menganalisis dan mendeteksi penyakit atau masalah dengan akurasi tinggi dalam hitungan detik",
      detail: "Teknologi computer vision dengan database 10,000+ sampel penyakit tanaman",
      gradientFrom: "from-purple-400",
      gradientTo: "to-pink-400",
      glowColor: "purple-400/30"
    },
    {
      number: "03",
      icon: FaLightbulb,
      title: "Smart Solution",
      description: "Dapatkan rekomendasi perawatan dan solusi terbaik yang disesuaikan dengan kondisi tanaman",
      detail: "Panduan lengkap dengan dosis pupuk, jadwal penyiraman, dan tips perawatan",
      gradientFrom: "from-emerald-400",
      gradientTo: "to-teal-400",
      glowColor: "emerald-400/30"
    }
  ];

  return (
    <section id="howitworks-section" className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      
      {/* Animated Background Elements - Reduced Brightness */}
      <div className="absolute inset-0">
        {/* Primary background orbs - Much more subtle */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/8 to-cyan-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-br from-emerald-500/8 to-teal-500/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Secondary subtle orbs - Further reduced */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/3 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/3 rounded-full blur-xl"></div>
        
        {/* Grid pattern overlay - More subtle */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header with Glassmorphism */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
           
          {/* Main Title */}
          <h2 className="text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Cara Kerja </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-blue-400">
              SmartFarm AI
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Proses yang sederhana namun powerful untuk mengoptimalkan hasil pertanian Anda
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          
          {/* Connection Line with Glassmorphism - More subtle */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px transform -translate-y-1/2 z-0">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={index}
                  className={`group relative transition-all duration-1000 ${
                    isVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-20 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  
                  {/* Main Glassmorphism Card */}
                  <div className={`relative p-6 rounded-2xl transition-all duration-500 transform ${
                    activeStep === index ? 'scale-105' : 'hover:scale-[1.02]'
                  } bg-white/8 backdrop-blur-xl border border-white/15 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] hover:bg-white/12`}>
                    
                    {/* Glow Effect - Much more subtle */}
                    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} blur-xl -z-10 scale-110`}></div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 left-6 z-20">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} backdrop-blur-sm border border-white/20`}>
                        <span className="text-white font-bold text-sm">{step.number}</span>
                      </div>
                    </div>

                    {/* Icon Container */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto mt-4 group-hover:scale-110 transition-all duration-300 shadow-2xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} backdrop-blur-sm border border-white/20`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="text-center relative z-10">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-white/80 leading-relaxed mb-3 text-sm group-hover:text-white/90 transition-colors">
                        {step.description}
                      </p>
                      <p className="text-xs text-white/60 group-hover:text-white/70 transition-colors">
                        {step.detail}
                      </p>
                    </div>

                    {/* Check Mark */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/15 backdrop-blur-sm border border-emerald-400/25 flex items-center justify-center">
                        <FaCheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                    </div>

                    {/* Arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-30">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} backdrop-blur-sm border border-white/20`}>
                          <FaArrowRight className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Arrow */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg rotate-90 bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} backdrop-blur-sm border border-white/20`}>
                        <FaArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}