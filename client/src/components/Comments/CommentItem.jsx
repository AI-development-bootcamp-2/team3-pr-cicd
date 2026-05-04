import React, { useState } from 'react';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, currentUser, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Use optional chaining in case author data is missing/deleted
  const authorName = comment.author?.username || '[deleted]';
  const authorAvatar = comment.author?.avatar || 'https://via.placeholder.com/40';
  const isOwner = currentUser && comment.author && currentUser._id === comment.author._id;
  const isAdmin = currentUser && currentUser.role === 'admin';
  const canModify = isOwner || isAdmin;

  const handleEditSubmit = async (newContent) => {
    await onEdit(comment._id, newContent);
    setIsEditing(false);
  };

  return (
    <div className="comment-item" style={styles.container}>
      <div className="comment-header" style={styles.header}>
        <img src={authorAvatar} alt={`${authorName}'s avatar`} style={styles.avatar} />
        <div>
          <strong style={styles.username}>{authorName}</strong>
          <span style={styles.date}>{new Date(comment.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {isEditing ? (
        <CommentForm 
          initialContent={comment.content} 
          onSubmit={handleEditSubmit} 
          onCancel={() => setIsEditing(false)} 
        />
      ) : (
        <div className="comment-body" style={styles.body}>
          <p>{comment.content}</p>
        </div>
      )}

      {!isEditing && canModify && (
        <div className="comment-actions" style={styles.actions}>
          <button onClick={() => setIsEditing(true)} style={styles.button}>Edit</button>
          <button onClick={() => onDelete(comment._id)} style={{ ...styles.button, color: 'red' }}>Delete</button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '12px',
    backgroundColor: '#fff'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '12px',
    objectFit: 'cover'
  },
  username: {
    display: 'block',
    fontSize: '14px',
    color: '#333'
  },
  date: {
    fontSize: '12px',
    color: '#888'
  },
  body: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.5'
  },
  actions: {
    marginTop: '8px',
    display: 'flex',
    gap: '8px'
  },
  button: {
    padding: '4px 8px',
    fontSize: '12px',
    cursor: 'pointer',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9'
  }
};

export default CommentItem;
