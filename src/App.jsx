import React, { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import FieldRegistrationPage from './pages/FieldRegistrationPage';
import { Button } from '@/components/ui/button';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🌾 Smart Farmer Assistant</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Sembunyikan Form' : 'Tambah Lahan'}
          </Button>
        </div>

        {/* Tugas Penting Hari Ini */}
        <div className="flex justify-between items-center bg-white shadow p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700">📝 Tugas Penting Hari Ini</h2>
          {!taskCompleted ? (
            <Button variant="outline" onClick={() => setTaskCompleted(true)}>
              Tandai Selesai
            </Button>
          ) : (
            <span className="text-green-600 font-medium">✅ Selesai</span>
          )}
        </div>

        {/* Form Pendaftaran Lahan */}
        {showForm && (
          <FieldRegistrationPage
            onBack={() => setShowForm(false)}
            onSuccess={() => {
              console.log('Lahan berhasil ditambahkan!');
              setShowForm(false);
            }}
          />
        )}
      </div>

      {/* Toast notification */}
      <Toaster />
    </div>
  );
}

export default App;
