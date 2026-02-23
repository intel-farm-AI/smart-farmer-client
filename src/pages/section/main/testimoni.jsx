import { useState, useEffect } from "react";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

export function Testimoni() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("testimonials-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Petani Cabai",
      location: "Brebes, Jawa Tengah",
      quote:
        "Sejak pakai SmartFarm AI, hasil panen saya meningkat 40% dan tanaman lebih sehat! AI-nya bisa deteksi penyakit sejak dini.",
      rating: 5,
      avatar: "BS",
      gradientFrom: "from-red-400",
      gradientTo: "to-orange-400",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      role: "Petani Tomat",
      location: "Lembang, Bandung",
      quote:
        "Aplikasi ini sangat membantu, terutama fitur deteksi penyakitnya yang akurat. Sekarang saya bisa antisipasi masalah lebih cepat.",
      rating: 5,
      avatar: "SN",
      gradientFrom: "from-pink-400",
      gradientTo: "to-rose-400",
    },
    {
      id: 3,
      name: "Agus Wijaya",
      role: "Petani Padi",
      location: "Karawang, Jawa Barat",
      quote:
        "Rekomendasi perawatan dari AI sangat mudah dipahami dan diterapkan. Produktivitas sawah meningkat drastis!",
      rating: 5,
      avatar: "AW",
      gradientFrom: "from-green-400",
      gradientTo: "to-emerald-400",
    },
  ];

  return (
    <section
      id="testimonials-section"
      className="py-24 relative overflow-hidden bg-slate-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-30 left-10 w-64 h-64 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-5 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-gray-200">Apa Kata </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-teal-300">
              Petani Kami?
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Ribuan petani telah merasakan manfaat SmartFarm AI dalam meningkatkan hasil panen mereka
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8 relative">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
              style={{ transitionDelay: `${index * 200}ms` }}
              onMouseEnter={() => setActiveTestimonial(index)}
            >
              {/* Glass Card */}
              <div
                className={`relative p-8 rounded-3xl transition-all duration-300 
                  bg-white/10 backdrop-blur-xl border border-white/20 
                  ${activeTestimonial === index
                    ? "shadow-xl"
                    : "hover:shadow-lg hover:bg-white/20"
                  }`}
              >
                {/* Quote Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${testimonial.gradientFrom} ${testimonial.gradientTo}`}
                >
                  <FaQuoteLeft className="w-6 h-6 text-white" />
                </div>

                {/* Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-400 mr-1" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-200 text-lg leading-relaxed mb-8 font-medium">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mr-4 bg-gradient-to-br ${testimonial.gradientFrom} ${testimonial.gradientTo}`}
                  >
                    <span className="text-white font-bold text-lg">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-300 font-medium">
                      {testimonial.role}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
