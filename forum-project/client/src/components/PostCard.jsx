import { useState } from 'react';
import { deletePost } from '../services/postService';

export default function PostCard({ post, currentUser, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isOwner = currentUser?._id === post.author?._id;

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setIsDeleting(true);
    try {
      await deletePost(post._id);
      onDeleted(post._id);
    } catch {
      alert('Failed to delete post. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="post-card">
      <div className="post-author">
        <img src={post.author.avatar} alt={post.author.username} />
        <span>{post.author.username}</span>
      </div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      <small>{new Date(post.createdAt).toLocaleString()}</small>
      {isOwner && (
        <div className="post-actions">
          <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
