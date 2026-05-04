import { useState, useEffect } from 'react';
import { getAllPosts } from '../services/postService';
import PostCard from '../components/PostCard';

export default function FeedPage({ currentUser }) {
  const [posts, setPosts]   = useState([]);
  const [page, setPage]     = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getAllPosts(page).then(data => {
      setPosts(prev => [...prev, ...data.posts]);
      if (data.posts.length < 10) setHasMore(false);
    });
  }, [page]);

  function handleDeleted(id) {
    setPosts(prev => prev.filter(p => p._id !== id));
  }

  return (
    <div>
      <h1>Forum</h1>
      {posts.map(post => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          onDeleted={handleDeleted}
        />
      ))}
      {hasMore && <button onClick={() => setPage(p => p + 1)}>Load more</button>}
    </div>
  );
}
