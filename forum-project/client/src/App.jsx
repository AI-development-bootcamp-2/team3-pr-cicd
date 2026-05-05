import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { me, clearUser } from './services/authService';

function ProtectedRoute({ isAuth, children }) {
  if (isAuth === null) return null;
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    me()
      .then(() => setIsAuth(true))
      .catch(() => { clearUser(); setIsAuth(false); });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute isAuth={isAuth}><div>Home (feed)</div></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute isAuth={isAuth}><div>Post detail</div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
