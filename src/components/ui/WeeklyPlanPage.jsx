// src/components/ui/WeeklyPlanPage.js

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, LoaderCircle, AlertTriangle, CalendarDays } from 'lucide-react';

const BASE_URL = "http://localhost:8000";

const WeeklyPlanPage = ({ onBack, namaLahan }) => {
  const { toast } = useToast();
  const [plan, setPlan] = useState({});
  const [plantName, setPlantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFullPlan = async () => {
      if (!namaLahan) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/full-plan/${encodeURIComponent(namaLahan)}`);
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.detail || "Gagal mengambil data rencana tanam.");
        }
        const data = await res.json();
        setPlan(data.rencana || {});
        setPlantName(data.nama_tanaman || "");
      } catch (err) {
        setError(err.message);
        toast({
          title: "❌ Gagal Memuat Rencana",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFullPlan();
    // ✨ FIX: Hapus 'toast' dari dependency array di bawah ini.
    // Effect ini hanya perlu berjalan kembali jika 'namaLahan' berubah.
  }, [namaLahan]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold">Kalender Tanam: {plantName || namaLahan}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-green-600"/>
            Rencana per Minggu
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8 text-gray-600">
              <LoaderCircle className="animate-spin mr-2"/> Memuat kalender tanam...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500 flex flex-col items-center gap-2">
              <AlertTriangle/> {error}
            </div>
          ) : Object.keys(plan).length === 0 ? (
            <p className="text-center py-8 text-gray-500">Tidak ada rencana tersedia untuk lahan ini.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(plan).map(([minggu, tugas]) => (
                <div key={minggu} className="p-4 rounded-lg border bg-gray-50/50 dark:bg-gray-800/50 flex gap-4">
                  <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded-md font-bold text-center w-16 py-2">
                    <span className="text-xs">Minggu</span>
                    <span className="block text-2xl">{minggu}</span>
                  </div>
                  <div className="flex items-center">
                    <p className="text-gray-800 dark:text-gray-200">{tugas}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyPlanPage;