// API Service for Help Desk & Ticketing System Frontend
// Connects React frontend to the backend APIs

// Configuration
export const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3000/api';

// API Service Object
export const api = {
  // Auth token management
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('jwtToken', token);
    } else {
      localStorage.removeItem('jwtToken');
    }
  },

  getAuthToken: () => localStorage.getItem('jwtToken'),

  // Auth API Functions
  auth: {
    register: (userData) =>
      fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).then((res) => {
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      }),

    login: (credentials) =>
      fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      }).then((res) => {
        if (!res.ok) throw new Error('Login failed');
        return res.json().then((data) => {
          api.setAuthToken(data.token);
          return data;
        });
      }),

    getProfile: () =>
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get profile');
        return res.json();
      }),

    logout: () => {
      api.setAuthToken(null);
      fetch(`${API_BASE}/auth/logout`, { method: 'POST' }).catch(() => {});
    },
  },

  // Dashboard API Functions
  dashboard: {
    getStats: () =>
      fetch(`${API_BASE}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get stats');
        return res.json();
      }),

    getMyTickets: () =>
      fetch(`${API_BASE}/dashboard/my-tickets`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get tickets');
        return res.json();
      }),
  },

  // Ticket API Functions
  ticket: {
    create: (ticketData) =>
      fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api.getAuthToken()}`,
        },
        body: JSON.stringify(ticketData),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to create ticket');
        return res.json();
      }),

    getAll: (filters = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) =>
        value && params.append(key, value)
      );
      return fetch(`${API_BASE}/tickets?${params}`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get tickets');
        return res.json();
      });
    },

    getDetail: (id) =>
      fetch(`${API_BASE}/tickets/${id}`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get ticket');
        return res.json();
      }),

    update: (id, ticketData) =>
      fetch(`${API_BASE}/tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api.getAuthToken()}`,
        },
        body: JSON.stringify(ticketData),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to update ticket');
        return res.json();
      }),

    delete: (id) =>
      fetch(`${API_BASE}/tickets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to delete ticket');
        return res.json();
      }),

    addComment: (ticketId, commentText) =>
      fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api.getAuthToken()}`,
        },
        body: JSON.stringify({ text: commentText }),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to add comment');
        return res.json();
      }),
  },

  // User API Functions (for assignment)
  user: {
    getAll: () =>
      fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get users');
        return res.json();
      }),
  },

  // Comment API Functions
  comment: {
    getComments: (ticketId) =>
      fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        headers: { Authorization: `Bearer ${api.getAuthToken()}` },
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to get comments');
        return res.json();
      }),

    addComment: (ticketId, commentText) =>
      fetch(`${API_BASE}/tickets/${ticketId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api.getAuthToken()}`,
        },
        body: JSON.stringify({ text: commentText }),
      }).then((res) => {
        if (!res.ok) throw new Error('Failed to add comment');
        return res.json();
      }),
  },
};