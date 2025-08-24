
import './index.css';

// React Router
import { Route, Routes } from 'react-router-dom';

// Context Providers
import { AuthProvider, RequireAuth, RedirectIfAuth } from './context/authContext';
import { LocationProvider } from './context/locationContext';

// Pages
import { Home } from './pages';
import { ChatWithAI } from './pages/chatwithai';
import Login from './pages/auth/login';
import { Register } from './pages/auth/register';
import ListAllTasks from './pages/listAllTasks';
import About from './pages/about';
import PredictionPage from './pages/prediction';
import MarketPrice from './pages/market';
import ReportPage from './pages/report';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <ChatWithAI />
            </RequireAuth>
          } />
          <Route path="/prediction" element={
            <RequireAuth>
              <PredictionPage />
            </RequireAuth>
          } />
          <Route path="/dashboard/listTasks" element={
            <RequireAuth>
              <ListAllTasks />
            </RequireAuth>
          } />
          <Route path="/market" element={
            <RequireAuth>
              <MarketPrice />
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
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen w-full text-center">404 | Halaman tidak ditemukan</div>} />
        </Routes>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;