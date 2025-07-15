
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
import TaskForm from './pages/taskform';
import ListAllTasks from './pages/listAllTasks';

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
          <Route path="/dashboard/addtask" element={
            <RequireAuth>
              <TaskForm />
            </RequireAuth>
          } />
          <Route path="/dashboard/listTasks" element={
            <RequireAuth>
              <ListAllTasks />
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