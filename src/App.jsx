import './index.css'

import { Route, Routes } from 'react-router-dom'
import { Home } from './pages'
import { ChatWithAI } from './pages/chatwithai'
import { LocationProvider } from './context/locationContext'
import Login from './pages/auth/login'
import { Register } from './pages/auth/register'
import { AuthProvider, RequireAuth, RedirectIfAuth } from './context/authContext'

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <ChatWithAI />
            </RequireAuth>
          } />
          <Route path="/login" element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          } />
          <Route path="/register" element={
            <RedirectIfAuth>
              <Register />
            </RedirectIfAuth>
          } />
          <Route path="*" element={<div className="text-center text-2xl">Halaman tidak ditemukan</div>} />
        </Routes>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;