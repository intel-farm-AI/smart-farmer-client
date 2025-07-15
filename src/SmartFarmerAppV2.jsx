import React, { useState, useEffect, useCallback } from 'react';
// Assuming these are the correct paths to your components
import DiseasePage from './components/ui/DiseasePage';
import FieldRegistrationPage from '@/components/ui/FieldRegistrationPage';
import WeeklyPlanPage from '@/components/ui/WeeklyPlanPage';
import HourlyWeatherPage from '@/components/ui/HourlyWeatherPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import {
  Sun, Cloud, Camera, MapPin, Calendar,
  CheckCircle, Clock, AlertTriangle, Eye, PlusCircle, ClipboardList, Moon, Loader2
} from 'lucide-react';
import provinces from 'idn-area-data/data/provinces.json';

const BASE_URL = "http://localhost:8000";

const SmartFarmerAppV2 = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());

  // ✨ Adjusted state to better match backend data
  const [dashboardData, setDashboardData] = useState(null);
  const [planSummary, setPlanSummary] = useState(null); // For the weekly plan summary
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✨ Field data state. We'll use the first field for the dashboard.
  const [fieldData, setFieldData] = useState([]); 
  const [activeFieldName, setActiveFieldName] = useState("Sawah Default");

  const [lat, setLat] = useState(-7.8014); // Default to Yogyakarta
  const [lon, setLon] = useState(110.3644);
  const [selectedCity, setSelectedCity] = useState('DI Yogyakarta');
  const [locationType, setLocationType] = useState('auto');
  const [taskMarked, setTaskMarked] = useState(false);
  const [showHourly, setShowHourly] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const { toast } = useToast();

  // Dark mode and time update effects (no changes)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Location detection (no changes)
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => { setLat(pos.coords.latitude); setLon(pos.coords.longitude); },
        (err) => {
          console.error("GPS Error:", err);
          toast({ title: '❌ Lokasi Gagal', description: 'Menggunakan lokasi manual.', variant: 'destructive' });
          setLocationType('manual');
        }
      );
    }
  }, [toast]);

  useEffect(() => {
    if (locationType === 'auto') getCurrentLocation();
  }, [locationType, getCurrentLocation]);
  
  // ✨ --- DATA FETCHING (ADJUSTED FOR main.py) --- ✨

  // ✨ 1. Fetch main dashboard data from `/daily-dashboard`
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // ✨ Endpoint now targets `/daily-dashboard`
    let url = `${BASE_URL}/daily-dashboard?nama_lahan=${encodeURIComponent(activeFieldName)}`;
    if (locationType === 'auto') {
      url += `&lat=${lat}&lon=${lon}`;
    } else {
      url += `&kota=${encodeURIComponent(selectedCity)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (e) {
      console.error("Failed to fetch dashboard data:", e);
      setError(`Gagal memuat data: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [activeFieldName, lat, lon, selectedCity, locationType]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // Rerun when any of its dependencies change

  // ✨ 2. Fetch weekly plan summary from `/weekly-plan-summary`
  useEffect(() => {
    const fetchPlanSummary = async () => {
      try {
        const response = await fetch(`${BASE_URL}/weekly-plan-summary?nama_lahan=${encodeURIComponent(activeFieldName)}`);
        if (!response.ok) throw new Error("Gagal mengambil ringkasan rencana.");
        const data = await response.json();
        setPlanSummary(data);
      } catch (e) {
        console.error("Failed to fetch plan summary:", e);
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      }
    };

    if (currentPage === 'plan-summary') {
      fetchPlanSummary();
    }
  }, [currentPage, activeFieldName, toast]);

  // ✨ 3. Fetch registered fields on startup
  useEffect(() => {
    const fetchFields = async () => {
        try {
            const response = await fetch(`${BASE_URL}/fields`);
            if (!response.ok) throw new Error("Could not fetch fields");
            const data = await response.json();
            setFieldData(data);
            // Set the active field to the first one if it exists
            if (data.length > 0) {
                setActiveFieldName(data[0].nama_lahan);
            }
        } catch (e) {
            console.error(e);
            // The backend seeds a default field, so this might not be critical
        }
    };
    fetchFields();
  }, []);

  // --- UI HELPER COMPONENTS ---

  const HeaderBar = () => (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🌿</span>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Smart Farmer Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={toggleTheme} variant="ghost" size="icon" className="rounded-full"><Moon className="w-5 h-5" /></Button>
        {currentPage === 'dashboard' && (
          <Button onClick={() => setCurrentPage('register')} variant="outline">
            <PlusCircle className="w-4 h-4 mr-2" /> Tambah Lahan
          </Button>
        )}
      </div>
    </div>
  );

  const formatTime = (date) => date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const getPriorityColor = (priority) => ({ good: 'bg-green-50 border-green-200', warning: 'bg-yellow-50 border-yellow-200', danger: 'bg-red-50 border-red-200' })[priority] || 'bg-gray-50 border-gray-200';
  const LoadingSpinner = () => <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-green-600" /><p className="ml-4 text-lg">Memuat data...</p></div>;
  const ErrorDisplay = ({ message }) => <Alert variant="destructive" className="my-4"><AlertTriangle className="h-4 w-4" /><AlertDescription>{message}</AlertDescription></Alert>;

  // --- PAGE COMPONENTS ---

  const DashboardPage = () => (
    <div className="space-y-6">
      {isLoading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      
      {dashboardData && !isLoading && !error && (
        <>
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">Selamat Datang! 🌾</h1>
            <p className="mb-2">{dashboardData.sapaan}</p>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <Calendar className="w-4 h-4" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-orange-500" />Tugas Penting Hari Ini</CardTitle></CardHeader>
            <CardContent>
              {taskMarked ? (
                <div className="text-center py-4"><p className="text-lg font-semibold text-green-700">🎉 Tugas Diselesaikan!</p></div>
              ) : (
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{dashboardData.tugas_hari_ini}</h3>
                  <Button variant="outline" onClick={() => setTaskMarked(true)}>Tandai Selesai</Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* ✨ Moved "Peringatan Besok" here from WeatherPage */}
          {dashboardData?.peringatan_besok && dashboardData.peringatan_besok.pesan !== "Cuaca besok normal." && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-700">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-300" />
              <AlertDescription>
                <h3 className="font-semibold text-red-800 dark:text-red-100">PERINGATAN BESOK</h3>
                <p className="font-bold text-red-700 dark:text-red-300">{dashboardData.peringatan_besok.pesan}</p>
                <p className="text-red-600 dark:text-red-400">{dashboardData.peringatan_besok.saran}</p>
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => setCurrentPage('weather')} className="h-20 text-lg bg-blue-600 hover:bg-blue-700"><div className="flex flex-col items-center gap-1"><Cloud className="w-8 h-8" /><span>Cek Cuaca</span></div></Button>
            <Button onClick={() => setCurrentPage('disease')} className="h-20 text-lg bg-green-600 hover:bg-green-700"><div className="flex flex-col items-center gap-1"><Camera className="w-8 h-8" /><span>Cek Penyakit</span></div></Button>
            <Button onClick={() => setCurrentPage('plan-summary')} className="h-20 text-lg bg-orange-600 hover:bg-orange-700"><div className="flex flex-col items-center gap-1"><ClipboardList className="w-8 h-8" /><span>Rencana Tani</span></div></Button>
          </div>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Sun className="w-5 h-5 text-yellow-500" />Cuaca Hari Ini</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(dashboardData.cuaca).map(([period, info]) => (
                  <div key={period} className="p-4 rounded-lg border bg-white dark:bg-gray-800 shadow-sm">
                    <div className="font-semibold capitalize mb-1">{period}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{info.cuaca} • {info.suhu}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{info.nasihat}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  const WeatherPage = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setCurrentPage('dashboard')} variant="outline">← Kembali</Button>
        <h1 className="text-2xl font-bold dark:text-white">Asisten Cuaca Cerdas</h1>
        <div />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <select value={locationType} onChange={(e) => setLocationType(e.target.value)} className="border p-2 rounded dark:bg-gray-900">
          <option value="auto">Otomatis (GPS)</option>
          <option value="manual">Manual</option>
        </select>
        {locationType === 'manual' && (
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="border p-2 rounded w-full md:w-64 dark:bg-gray-900">
            {provinces.map((prov) => (<option key={prov.code} value={prov.name}>{prov.name}</option>))}
          </select>
        )}
      </div>
      
      {isLoading && <LoadingSpinner />}
      {error && <ErrorDisplay message={error} />}
      {dashboardData && !isLoading && !error && (
        <>
          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /><span>Lokasi: {locationType === 'manual' ? selectedCity : 'Otomatis'}</span></div>
              <div className="flex items-center gap-2 text-sm text-gray-600"><Clock className="w-4 h-4" /><span>Pembaruan: {dashboardData.last_update}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Detail Cuaca Hari Ini</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dashboardData.cuaca).map(([periode, info]) => (
                <div key={periode} className={`p-4 rounded-lg border-2 ${getPriorityColor(info.priority)}`}>
                  <div className="font-semibold capitalize">{periode}</div>
                  <p>{info.cuaca}. Suhu: {info.suhu}.</p>
                  <p className="text-sm mt-1"><span className="font-medium">Nasihat:</span> {info.nasihat}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" variant="outline" onClick={() => setShowHourly(true)}><Eye className="w-4 h-4 mr-2" />Lihat Detail per Jam</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );

  // --- MAIN APP RETURN ---
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <HeaderBar />

        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'weather' && <WeatherPage />}
        
        {/* ✨ Pass baseUrl to pages that make their own API calls */}
        {currentPage === 'disease' && <DiseasePage onBack={() => setCurrentPage('dashboard')} baseUrl={BASE_URL} />}
        
        {currentPage === 'register' && (
          <FieldRegistrationPage
            onBack={() => setCurrentPage('dashboard')}
            onSuccess={() => {
              toast({ title: "✅ Sukses", description: "Lahan baru berhasil didaftarkan." });
              setCurrentPage('dashboard');
              fetchDashboardData(); // Refresh data after registration
            }}
            baseUrl={BASE_URL}
          />
        )}
        
        {currentPage === 'plan-summary' && (
          <WeeklyPlanPage
            onBack={() => setCurrentPage('dashboard')}
            namaLahan={activeFieldName}
            planSummary={planSummary} // Pass the fetched summary
            isLoading={!planSummary} // Let the component know if it's loading
          />
        )}
        
        {showHourly && (
          <HourlyWeatherPage
            lat={lat}
            lon={lon}
            onBack={() => setShowHourly(false)}
            baseUrl={BASE_URL} // Pass baseUrl for its own fetch
          />
        )}
      </div>
    </div>
  );
};

export default SmartFarmerAppV2;