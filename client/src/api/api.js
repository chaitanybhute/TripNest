// Centralised API helper
// All requests go to /api/* — Vite proxies to Express on port 3000 in dev

const BASE = '/api';

async function request(method, path, body = null, isFormData = false) {
  const options = {
    method,
    credentials: 'include', // send session cookies
    headers: {},
  };

  if (body) {
    if (isFormData) {
      // Let the browser set Content-Type for multipart
      options.body = body;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
  }

  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

// ---- Listings ----
export const getListings = () => request('GET', '/listing');
export const getListing = (id) => request('GET', `/listing/${id}`);
export const createListing = (formData) => request('POST', '/listing', formData, true);
export const updateListing = (id, formData) => request('PUT', `/listing/${id}`, formData, true);
export const deleteListing = (id) => request('DELETE', `/listing/${id}`);

// ---- Reviews ----
export const createReview = (listingId, reviewData) =>
  request('POST', `/listing/${listingId}/reviews`, reviewData);
export const deleteReview = (listingId, reviewId) =>
  request('DELETE', `/listing/${listingId}/reviews/${reviewId}`);

// ---- Auth ----
export const getMe = () => request('GET', '/me');
export const signup = (data) => request('POST', '/signup', data);
export const login = (data) => request('POST', '/login', data);
export const logout = () => request('GET', '/logout');
