import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const PredictForm = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error('Gagal prediksi:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <Button onClick={handleUpload} disabled={loading}>
        {loading ? 'Memproses...' : 'Cek Penyakit'}
      </Button>

      {result && (
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="font-bold text-lg">Hasil Deteksi</h3>
          <p><strong>Penyakit:</strong> {result.label}</p>
          <p><strong>Akurasi:</strong> {result.confidence}%</p>
          <p><strong>Deskripsi:</strong> {result.advice}</p>
        </div>
      )}
    </div>
  );
};

export default PredictForm;

