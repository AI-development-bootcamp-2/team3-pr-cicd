import { deletePost } from '../services/postService';

export default function PostCard({ post, currentUser, onDeleted }) {
  const isOwner = currentUser && currentUser._id === post.author._id;

  async function handleDelete() {
    await deletePost(post._id);
    onDeleted(post._id);
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
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
