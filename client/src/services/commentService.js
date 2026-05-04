const API_URL = '/api';

/**
 * Helper to handle fetch responses and common errors
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }
  return data;
};

/**
 * Fetch all comments for a specific post
 * @param {string} postId - The ID of the post
 * @returns {Promise<Array>} Array of comments
 */
export const getCommentsForPost = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`);
  return handleResponse(response);
};

/**
 * Add a new comment to a post
 * @param {string} postId - The ID of the post
 * @param {string} content - The content of the comment
 * @param {string} token - The auth token (JWT)
 * @returns {Promise<Object>} The created comment
 */
export const addComment = async (postId, content, token) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({ content })
  });
  return handleResponse(response);
};

/**
 * Edit an existing comment
 * @param {string} commentId - The ID of the comment to edit
 * @param {string} content - The updated content
 * @param {string} token - The auth token (JWT)
 * @returns {Promise<Object>} The updated comment
 */
export const editComment = async (commentId, content, token) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    body: JSON.stringify({ content })
  });
  return handleResponse(response);
};

/**
 * Delete a comment
 * @param {string} commentId - The ID of the comment to delete
 * @param {string} token - The auth token (JWT)
 * @returns {Promise<Object>} Success message
 */
export const deleteComment = async (commentId, token) => {
  const response = await fetch(`${API_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
  return handleResponse(response);
};
