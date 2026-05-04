import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { getToken } from './services/authService';

// BUG: ProtectedRoute only checks localStorage — no server-side token validation.
// A user with an expired or forged token passes this guard and reaches the page;
// the real rejection only happens when the page's API call fires.
function ProtectedRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Placeholder protected routes — swap element={} for real page components */}
        <Route path="/" element={<ProtectedRoute><div>Home (feed)</div></ProtectedRoute>} />
        <Route path="/posts/:id" element={<ProtectedRoute><div>Post detail</div></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
