const BASE_URL = 'http://localhost:3000/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
}

export async function getAllPosts(page = 1, limit = 10) {
  const res = await fetch(`${BASE_URL}/posts?page=${page}&limit=${limit}`);
  return res.json();
}

export async function getPostById(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`);
  return res.json();
}

export async function createPost(data) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body:    JSON.stringify(data),
  });
  return res.json();
}

export async function updatePost(id, data) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body:    JSON.stringify(data),
  });
  return res.json();
}

export async function deletePost(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    method:  'DELETE',
    headers: getAuthHeader(),
  });
  return res.json();
}

export async function getPostsByUser(userId) {
  const res = await fetch(`${BASE_URL}/users/${userId}/posts`);
  return res.json();
}
