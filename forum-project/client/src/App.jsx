import { useState, useEffect } from 'react';
import FeedPage from './pages/FeedPage.jsx';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'user') {
        setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  if (!currentUser) return <p>Please log in to view the forum.</p>;

  return <FeedPage currentUser={currentUser} />;
}
