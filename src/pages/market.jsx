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
    region: "Jawa Tengah",
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
    region: "Jawa Timur",
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
    region: "Lampung",
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
    region: "Jawa Tengah",
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
    region: "Jawa Timur",
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
      case "up": return <FiTrendingUp className="w-4 h-4 text-green-500" />;
      case "down": return <FiTrendingDown className="w-4 h-4 text-red-500" />;
      default: return <FiMinus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend, change) => {
    if (trend === "up") return "text-green-600 bg-green-50";
    if (trend === "down") return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Harga Komoditas Pasar</h1>
              <p className="text-lg text-gray-600">Pantau harga terkini komoditas pertanian di berbagai daerah</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <FiCalendar className="w-4 h-4 mr-2" />
                Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FiSearch className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari komoditas..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="md:w-48">
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                  >
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:w-48">
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Urutkan: Nama</option>
                    <option value="price">Urutkan: Harga</option>
                    <option value="change">Urutkan: Perubahan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Market Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredData.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.region}</p>
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(item.trend)}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-gray-800 mb-1">
                        {formatCurrency(item.price)}
                        <span className="text-lg font-normal text-gray-500">/{item.unit}</span>
                      </div>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getTrendColor(item.trend)}`}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Kualitas:</span>
                        <span className="font-medium">{item.quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Update:</span>
                        <span className="font-medium">{item.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FiSearch className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">Tidak ada komoditas ditemukan</h3>
                <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter yang dipilih</p>
              </div>
            )}

            {/* Market Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Ringkasan Pasar</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Naik</p>
                      <p className="text-2xl font-bold text-green-700">
                        {marketData.filter(item => item.trend === 'up').length}
                      </p>
                    </div>
                    <FiTrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 font-medium">Turun</p>
                      <p className="text-2xl font-bold text-red-700">
                        {marketData.filter(item => item.trend === 'down').length}
                      </p>
                    </div>
                    <FiTrendingDown className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 font-medium">Stabil</p>
                      <p className="text-2xl font-bold text-gray-700">
                        {marketData.filter(item => item.trend === 'stable').length}
                      </p>
                    </div>
                    <FiMinus className="w-8 h-8 text-gray-500" />
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