import { useState, useEffect } from 'react';
import { getAllPosts } from '../services/postService';
import PostCard from '../components/PostCard';

export default function FeedPage({ currentUser }) {
  const [posts, setPosts]         = useState([]);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    getAllPosts(page)
      .then(data => {
        if (!isMounted) return;
        setPosts(prev => [...prev, ...data.posts]);
        if (data.posts.length < 10) setHasMore(false);
      })
      .catch(() => {
        if (isMounted) setError('Failed to load posts. Please try again.');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [page]);

  function handleDeleted(id) {
    setPosts(prev => prev.filter(p => p._id !== id));
  }

  return (
    <div>
      <h1>Forum</h1>
      {error && <p className="error">{error}</p>}
      {posts.length === 0 && !isLoading && <p>No posts yet.</p>}
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          onDeleted={handleDeleted}
        />
      ))}
      {hasMore && (
        <button onClick={() => setPage(p => p + 1)} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
