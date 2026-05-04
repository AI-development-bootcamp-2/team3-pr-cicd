import { useState } from 'react';
import FeedPage from './pages/FeedPage.jsx';

export default function App() {
  const [currentUser] = useState(() => {
    const id = localStorage.getItem('userId');
    return id ? { _id: id } : null;
  });

  return <FeedPage currentUser={currentUser} />;
}
