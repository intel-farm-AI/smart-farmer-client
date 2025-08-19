import { useState, useEffect } from "react";
import { 
  FaRocket,
  FaDatabase,
  FaSync,
  FaArrowRight,
} from "react-icons/fa";

export function Describe() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("describe-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: FaRocket,
      title: "Akses Mudah",
      description:
        "Antarmuka intuitif yang dirancang khusus untuk petani Indonesia dengan teknologi responsif",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FaDatabase,
      title: "Berbasis Data",
      description:
        "Dibangun dengan riset mendalam dan database komprehensif untuk hasil yang akurat",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: FaSync,
      title: "Selalu Berkembang",
      description:
        "Platform yang terus diperbarui dengan teknologi terbaru dan feedback pengguna",
      gradient: "from-emerald-500 to-teal-500",
    },
  ];

  return (
    <section
      id="describe-section"
      className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-gray-900 relative overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Image Section */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-3 border border-white/10">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src="/src/assets/images/homepage/daun-segar.jpeg"
                    alt="SmartFarm AI Platform"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
                    <div className="text-sm font-semibold text-white">AI Powered</div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/20">
                    <div className="text-sm font-semibold text-white">Smart Technology</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div
            className={`space-y-10 transition-all duration-1000 delay-300 ${
              isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
          >
            {/* Header */}
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                Mengapa Memilih{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  SmartFarm AI?
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                SmartFarm AI hadir sebagai solusi komprehensif untuk modernisasi
                pertanian Indonesia. Dengan menggabungkan teknologi terdepan dan
                pemahaman mendalam tentang kondisi lokal, kami membantu petani
                mencapai produktivitas optimal.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className="group p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                          {feature.title}
                        </h4>
                        <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
