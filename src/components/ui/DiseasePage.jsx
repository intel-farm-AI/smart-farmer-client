import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from "@/components/ui/label"; // Pastikan Label di-import
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, FileImage, ArrowLeft, BrainCircuit, Loader2, AlertTriangle, Circle, X } from 'lucide-react';

const DiseasePage = ({ onBack, baseUrl }) => {
  const [mode, setMode] = useState('initial'); 
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stream, setStream] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = async () => {
    resetState();
    setMode('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Kamera tidak dapat diakses. Pastikan Anda telah memberikan izin.");
      setMode('initial');
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      canvas.toBlob((blob) => {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }, 'image/jpeg');
      stopCamera();
      setMode('preview');
    }
  };
  
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      resetState();
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMode('preview');
    }
  };

  const resetState = () => {
    stopCamera();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setMode('initial');
    setImageFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setIsLoading(false);
  };

  const handleDetect = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    const formData = new FormData();
    formData.append('file', imageFile);
    try {
      const response = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Gagal mendapatkan prediksi dari server.');
      const result = await response.json();
      setPrediction(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const formatLabel = (label = '') => {
    return label
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button onClick={mode === 'initial' ? onBack : resetState} variant="outline" size="icon">
            {mode === 'initial' ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
          <CardTitle className="text-xl">Deteksi Penyakit Tanaman</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">

        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="border-2 border-dashed rounded-lg p-1 aspect-video flex justify-center items-center bg-gray-50 dark:bg-gray-800 overflow-hidden">
          {mode === 'initial' && (
            <div className="text-center text-gray-500">
              <FileImage className="mx-auto h-12 w-12" />
              <p>Pilih sumber gambar untuk memulai</p>
            </div>
          )}
          {mode === 'camera' && (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
          )}
          {mode === 'preview' && previewUrl && (
            <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
          )}
        </div>

        {mode === 'initial' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => fileInputRef.current.click()}><FileImage className="mr-2 h-4 w-4" /> Pilih dari Galeri</Button>
            <Button onClick={startCamera}><Camera className="mr-2 h-4 w-4" /> Gunakan Kamera</Button>
          </div>
        )}

        {mode === 'camera' && (
          <div className="flex justify-center">
            <Button onClick={handleCapture} className="rounded-full w-20 h-20">
              <Circle className="w-12 h-12 text-white" />
              <span className="sr-only">Capture photo</span>
            </Button>
          </div>
        )}
        
        {mode === 'preview' && (
          <>
            <Button onClick={handleDetect} disabled={!imageFile || isLoading} className="w-full text-lg py-6">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <BrainCircuit className="mr-2 h-5 w-5" />}
              {isLoading ? 'Mendeteksi...' : 'Deteksi Penyakit'}
            </Button>
            
            {/* --- Results Section --- */}
            {error && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}

            {prediction && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                <CardHeader><CardTitle>Hasil Deteksi</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* ✨ Nama Penyakit & Keyakinan */}
                  <div>
                    <Label className="text-sm text-gray-500 dark:text-gray-400">Penyakit Terdeteksi</Label>
                    <h3 className="font-bold text-xl text-green-800 dark:text-green-300">{formatLabel(prediction.label)}</h3>
                  </div>

                  {/* ✨ Deskripsi Penyakit */}
                  <div>
                    <Label className="text-sm text-gray-500 dark:text-gray-400">Deskripsi</Label>
                    <p className="text-gray-700 dark:text-gray-200">{prediction.deskripsi}</p>
                  </div>
                  
                  {/* ✨ Rekomendasi Obat */}
                  {prediction.obat_rekomendasi && prediction.obat_rekomendasi.length > 0 && (
                    <div>
                      <Label className="text-sm text-gray-500 dark:text-gray-400">Rekomendasi Obat / Bahan Aktif</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {prediction.obat_rekomendasi.map((obat, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full text-sm font-mono">
                            {obat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseasePage;