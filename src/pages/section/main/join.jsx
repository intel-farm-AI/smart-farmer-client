import { useState, useEffect } from "react";
import { FaArrowRight, FaUsers, FaLeaf, FaRocket } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

// Mock Link component since react-router-dom is not available
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

export default function Join() {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('join-section');
    if (element) observer.observe(element);

    // Generate floating particles
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          delay: Math.random() * 10,
          duration: Math.random() * 20 + 10
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    return () => observer.disconnect();
  }, []);

  return (
    <section id="join-section" className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-900 to-emerald-900">
      
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Primary gradient orbs */}
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-700/20 to-blue-700/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-teal-700/15 to-green-700/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Floating particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white/10 rounded-full animate-bounce"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Main Content */}
        <div className={`text-center transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          {/* Main Title */}
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">Bergabunglah dengan </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-cyan-300">
              Komunitas SmartFarm AI!
            </span>
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-12">
            Jadilah bagian dari revolusi pertanian digital bersama ribuan petani lainnya dan rasakan peningkatan hasil panen hingga 40%.
          </p>

          {/* CTA Button */}
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <Link 
              to="/login" 
              className="group inline-flex items-center px-8 py-3 text-xl font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-white via-green-50 to-emerald-50 text-green-800 shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(255,255,255,0.3)] border border-white/20 backdrop-blur-sm"
            >
              <span>Mulai Sekarang</span>
              <FaArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/20 to-green-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}