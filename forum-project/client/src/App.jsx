import { useState, useEffect } from 'react';
import FeedPage from './pages/FeedPage.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'user') {
        try {
          setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setCurrentUser(null);
        }
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!currentUser) return <p>Please log in to view the forum.</p>;

  return <FeedPage currentUser={currentUser} />;
}
