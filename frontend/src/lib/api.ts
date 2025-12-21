import axios from 'axios';

// Configure your backend API base URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Listings API
export const listingsAPI = {
  getAll: () => api.get('/listings'),
  getById: (id: string) => api.get(`/listings/${id}`),
  create: (data: {
    title: string;
    description: string;
    price: number;
    location: string;
    image?: string;
  }) => api.post('/listings', data),
  update: (id: string, data: any) => api.put(`/listings/${id}`, data),
  delete: (id: string) => api.delete(`/listings/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getByListing: (listingId: string) => api.get(`/listings/${listingId}/reviews`),
  create: (listingId: string, data: { rating: number; comment: string }) =>
    api.post(`/listings/${listingId}/reviews`, data),
  delete: (listingId: string, reviewId: string) =>
    api.delete(`/listings/${listingId}/reviews/${reviewId}`),
};

// Bookings API
export const bookingsAPI = {
  create: (data: { listingId: string; checkIn: string; checkOut: string }) =>
    api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getHostBookings: () => api.get('/bookings/host'),
  cancel: (id: string) => api.delete(`/bookings/${id}`),
};

export default api;
