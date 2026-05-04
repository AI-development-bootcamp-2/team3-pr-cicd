import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { getUser } from './services/authService';

function ProtectedRoute({ children }) {
  return getUser() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><div>Home (feed)</div></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><div>Post detail</div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
