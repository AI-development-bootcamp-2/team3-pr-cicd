import React, { useEffect, useState } from 'react';
import { getCommentsForPost, addComment, editComment, deleteComment } from '../../services/commentService';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const CommentsList = ({ postId, currentUser, token }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const data = await getCommentsForPost(postId);
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content) => {
    const newComment = await addComment(postId, content, token);
    setComments((prev) => [...prev, newComment]);
  };

  const handleEditComment = async (commentId, content) => {
    const updatedComment = await editComment(commentId, content, token);
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? updatedComment : c))
    );
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    await deleteComment(commentId, token);
    setComments((prev) => prev.filter((c) => c._id !== commentId));
  };

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="comments-section" style={styles.container}>
      <h3>Comments ({comments.length})</h3>
      
      {currentUser ? (
        <CommentForm onSubmit={handleAddComment} />
      ) : (
        <p>Please log in to add a comment.</p>
      )}

      <div className="comments-list">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            currentUser={currentUser}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #eaeaea'
  }
};

export default CommentsList;
