const BASE_URL = '/api';

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const getAllPosts     = (page = 1, limit = 10) => apiRequest(`/posts?page=${page}&limit=${limit}`);
export const getPostById    = (id)       => apiRequest(`/posts/${id}`);
export const createPost     = (data)     => apiRequest('/posts',       { method: 'POST',   body: JSON.stringify(data) });
export const updatePost     = (id, data) => apiRequest(`/posts/${id}`, { method: 'PUT',    body: JSON.stringify(data) });
export const deletePost     = (id)       => apiRequest(`/posts/${id}`, { method: 'DELETE' });
export const getPostsByUser = (userId)   => apiRequest(`/users/${userId}/posts`);
