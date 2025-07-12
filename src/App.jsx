import './index.css'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages'
import { ChatWithAI } from './pages/chatwithai'
import { LocationProvider } from './context/locationContext'
import Login from './pages/auth/login'
import { Register } from './pages/auth/register'

function App() {
  return (
    <LocationProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/try-ai" element={<ChatWithAI />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<div className="text-center text-2xl">Halaman tidak ditemukan</div>} />
      </Routes>
    </LocationProvider>
  )
}

export default App
