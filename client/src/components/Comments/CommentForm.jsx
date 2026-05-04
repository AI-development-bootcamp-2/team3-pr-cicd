import React, { useState } from 'react';

const CommentForm = ({ initialContent = '', onSubmit, onCancel }) => {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent('');
    } catch (err) {
      console.error('Failed to submit comment:', err);
      alert('Error submitting comment: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        style={styles.textarea}
        rows="3"
        required
      />
      <div style={styles.actions}>
        <button type="submit" disabled={isSubmitting || !content.trim()} style={styles.submitBtn}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    resize: 'vertical',
    fontFamily: 'inherit',
    fontSize: '14px'
  },
  actions: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end'
  },
  submitBtn: {
    padding: '8px 16px',
    backgroundColor: '#0066cc',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: '#eee',
    color: '#333',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default CommentForm;
