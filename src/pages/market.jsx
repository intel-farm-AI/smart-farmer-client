import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiSearch, FiFilter, FiCalendar } from 'react-icons/fi';
import { MainLayout } from "../layout/main";

// Simulated market data
const marketData = [
  {
    id: 1,
    name: "Padi",
    price: 5200,
    unit: "kg",
    change: 2.5,
    trend: "up",
    lastUpdate: "2 jam lalu",
    region: "Jawa Barat",
    quality: "Kualitas Premium"
  },
  
  {
    id: 2,
    name: "Jagung",
    price: 3800,
    unit: "kg", 
    change: -1.2,
    trend: "down",
    lastUpdate: "1 jam lalu",
    region: "Jawa Barat",
    quality: "Kualitas A"
  },
  {
    id: 3,
    name: "Kedelai",
    price: 8500,
    unit: "kg",
    change: 3.1,
    trend: "up",
    lastUpdate: "3 jam lalu",
    region: "Jawa Barat",
    quality: "Kualitas Premium"
  },
  {
    id: 4,
    name: "Singkong",
    price: 2100,
    unit: "kg",
    change: 0,
    trend: "stable",
    lastUpdate: "1 jam lalu",
    region: "Jawa Barat",
    quality: "Kualitas B"
  },
  {
    id: 5,
    name: "Kentang",
    price: 12000,
    unit: "kg",
    change: -2.8,
    trend: "down",
    lastUpdate: "30 menit lalu",
    region: "Jawa Barat",
    quality: "Kualitas A"
  },
  {
    id: 6,
    name: "Cabai",
    price: 35000,
    unit: "kg",
    change: 5.7,
    trend: "up",
    lastUpdate: "45 menit lalu",
    region: "Jawa Barat",
    quality: "Kualitas Premium"
  },
  {
    id: 7,
    name: "Tomat",
    price: 8900,
    unit: "kg",
    change: 1.8,
    trend: "up",
    lastUpdate: "2 jam lalu",
    region: "Jawa Barat",
    quality: "Kualitas A"
  }
];

export default function MarketPrice() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Semua");
  const [sortBy, setSortBy] = useState("name");
  const [filteredData, setFilteredData] = useState(marketData);
  
  const regions = ["Semua", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Lampung"];

  useEffect(() => {
    let filtered = marketData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRegion === "Semua" || item.region === selectedRegion)
    );

    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "change") {
      filtered.sort((a, b) => b.change - a.change);
    }

    setFilteredData(filtered);
  }, [searchTerm, selectedRegion, sortBy]);

  const getTrendIcon = (trend) => {
    switch(trend) {
      case "up": return <FiTrendingUp className="w-5 h-5 text-emerald-400" />;
      case "down": return <FiTrendingDown className="w-5 h-5 text-red-400" />;
      default: return <FiMinus className="w-5 h-5 text-slate-400" />;
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getTrendColor = (trend, change) => {
    if (trend === "up") return "text-emerald-300 bg-emerald-900/30 border border-emerald-700/50";
    if (trend === "down") return "text-red-300 bg-red-900/30 border border-red-700/50";
    return "text-slate-300 bg-slate-700/50 border border-slate-600/50";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <MainLayout withNavigation={false} withSidebar={true}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 pt-25 p-6">
          <div className="mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div>
                  <h1 className="text-4xl pb-2 sm:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent text-center lg:text-left">
                    Harga Komoditas Pasar
                  </h1>
                  <p className="text-lg text-slate-300">Pantau harga terkini komoditas pertanian di berbagai daerah</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-slate-400 bg-slate-800/50 backdrop-blur-sm rounded-lg px-4 py-3 border border-slate-700/50">
                <FiCalendar className="w-4 h-4 mr-2 text-emerald-400" />
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari komoditas..."
                      className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="md:w-48">
                  <select 
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    {regions.map(region => (
                      <option key={region} value={region} className="bg-slate-800">{region}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:w-48">
                  <select 
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name" className="bg-slate-800">Urutkan: Nama</option>
                    <option value="price" className="bg-slate-800">Urutkan: Harga</option>
                    <option value="change" className="bg-slate-800">Urutkan: Perubahan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Market Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredData.map((item) => (
                <div key={item.id} className="group bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 overflow-hidden hover:shadow-emerald-500/10">
                  <div className="p-6 relative">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                          <p className="text-sm text-slate-400 flex items-center">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                            {item.region}
                          </p>
                        </div>
                        <div className="flex items-center bg-slate-700/50 rounded-lg p-2">
                          {getTrendIcon(item.trend)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
                          {formatCurrency(item.price)}
                          <span className="text-lg font-normal text-slate-400">/{item.unit}</span>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${getTrendColor(item.trend)}`}>
                          {item.change > 0 ? '+' : ''}{item.change}%
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                          <span className="text-slate-400 text-sm">Kualitas:</span>
                          <span className="font-medium text-slate-200">{item.quality}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
                          <span className="text-slate-400 text-sm">Update:</span>
                          <span className="font-medium text-emerald-300">{item.lastUpdate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-16 bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-slate-700/50">
                <div className="text-slate-500 mb-4">
                  <FiSearch className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">Tidak ada komoditas ditemukan</h3>
                <p className="text-slate-400">Coba ubah kata kunci pencarian atau filter yang dipilih</p>
              </div>
            )}

            {/* Market Summary */}
            <div className="bg-slate-800/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
              <div className="flex items-center mb-6">
                <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Ringkasan Pasar
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 rounded-2xl p-6 border border-emerald-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-300 font-medium mb-1">Naik</p>
                      <p className="text-3xl font-bold text-emerald-200">
                        {marketData.filter(item => item.trend === 'up').length}
                      </p>
                    </div>
                    <div className="bg-emerald-800/50 rounded-xl p-3">
                      <FiTrendingUp className="w-8 h-8 text-emerald-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-2xl p-6 border border-red-700/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-300 font-medium mb-1">Turun</p>
                      <p className="text-3xl font-bold text-red-200">
                        {marketData.filter(item => item.trend === 'down').length}
                      </p>
                    </div>
                    <div className="bg-red-800/50 rounded-xl p-3">
                      <FiTrendingDown className="w-8 h-8 text-red-400" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-700/50 to-slate-600/30 rounded-2xl p-6 border border-slate-600/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-300 font-medium mb-1">Stabil</p>
                      <p className="text-3xl font-bold text-slate-200">
                        {marketData.filter(item => item.trend === 'stable').length}
                      </p>
                    </div>
                    <div className="bg-slate-600/50 rounded-xl p-3">
                      <FiMinus className="w-8 h-8 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}