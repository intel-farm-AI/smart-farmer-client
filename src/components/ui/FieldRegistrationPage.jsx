// src/components/ui/FieldRegistrationPage.js

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, LoaderCircle } from 'lucide-react';

const FieldRegistrationPage = ({ onBack, onSuccess, baseUrl }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nama_lahan: '',
    tanaman: '',
    jenis_lahan: '', // ✨ State baru untuk jenis lahan
    luas_m2: '',
    tanggal_tanam: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // ✨ Daftar jenis lahan untuk dropdown
  const jenisLahanOptions = [
    "Sawah Irigasi",
    "Sawah Tadah Hujan",
    "Tegal/Ladang",
    "Perkebunan",
    "Huma (Ladang Berpindah)",
    "Lahan Rawa",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi sederhana
    for (const key in formData) {
      if (!formData[key]) {
        toast({
          title: "❌ Gagal",
          description: `Kolom "${key.replace('_', ' ')}" tidak boleh kosong.`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/register-field`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          luas_m2: parseInt(formData.luas_m2, 10), // Pastikan luas adalah angka
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mendaftarkan lahan di server.');
      }
      
      toast({
        title: "✅ Berhasil",
        description: "Lahan baru telah berhasil didaftarkan.",
      });
      onSuccess(); // Panggil callback sukses dari parent

    } catch (error) {
      toast({
        title: "❌ Terjadi Kesalahan",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Daftarkan Lahan Baru</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nama_lahan">Nama Lahan</Label>
            <Input id="nama_lahan" name="nama_lahan" value={formData.nama_lahan} onChange={handleChange} placeholder="Contoh: Sawah Binaan" />
          </div>
          
          <div>
            <Label htmlFor="tanaman">Jenis Tanaman Utama</Label>
            <Input id="tanaman" name="tanaman" value={formData.tanaman} onChange={handleChange} placeholder="Contoh: Padi, Jagung, Cabai" />
          </div>

          {/* ✨ FORM INPUT UNTUK JENIS LAHAN */}
          <div>
            <Label htmlFor="jenis_lahan">Jenis Lahan</Label>
            <select
              id="jenis_lahan"
              name="jenis_lahan"
              value={formData.jenis_lahan}
              onChange={handleChange}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="" disabled>Pilih jenis lahan...</option>
              {jenisLahanOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="luas_m2">Luas Lahan (m²)</Label>
            <Input id="luas_m2" name="luas_m2" type="number" value={formData.luas_m2} onChange={handleChange} placeholder="Contoh: 1000" />
          </div>

          <div>
            <Label htmlFor="tanggal_tanam">Tanggal Mulai Tanam</Label>
            <Input id="tanggal_tanam" name="tanggal_tanam" type="date" value={formData.tanggal_tanam} onChange={handleChange} />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="animate-spin mr-2" /> : null}
            Daftarkan Lahan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FieldRegistrationPage;