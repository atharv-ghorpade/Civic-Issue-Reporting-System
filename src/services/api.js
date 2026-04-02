import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export const mockAuthorities = [
  { id: 101, name: 'John Doe (Roads)', department: 'Roads' },
  { id: 102, name: 'Jane Smith (Utilities)', department: 'Utilities' },
  { id: 103, name: 'Bob Wilson (Sanitation)', department: 'Sanitation' },
  { id: 104, name: 'Support Team (Other)', department: 'Other' }
];

let mockIssues = [
  { id: 1, title: 'Pothole on Main St', category: 'Roads', priority: 'High', status: 'submitted', location: '123 Main St', date: '2023-10-01' },
  { id: 2, title: 'Broken Streetlight', category: 'Utilities', priority: 'Medium', status: 'in progress', location: '4th Avenue', date: '2023-10-02', assignedTo: 102, assignedName: 'Jane Smith (Utilities)' },
];

export const mockLogin = async (data) => {
  if (data.email.includes('admin')) {
    return { data: { user: { id: 1, role: 'admin', name: 'Admin', email: data.email }, token: 'mock-token-admin' } };
  } else if (data.email.includes('authority')) {
    return { data: { user: { id: 101, role: 'authority', name: 'John Doe', email: data.email, department: 'Roads' }, token: 'mock-token-auth' } };
  }
  return { data: { user: { id: 2, role: 'citizen', name: 'Citizen', email: data.email }, token: 'mock-token-citizen' } };
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.warn("API Error, using fallback data...");
    const { url, method, data } = error.config;
    
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
      return mockLogin(JSON.parse(data));
    }
    
    if (url.includes('/issues') && method === 'get') {
      return { data: mockIssues };
    }

    if (url.includes('/authorities') && method === 'get') {
        return { data: mockAuthorities };
    }

    if (url.includes('/issues') && method === 'post') {
      const newIssue = { id: Date.now(), ...JSON.parse(data), status: 'submitted', date: new Date().toISOString() };
      mockIssues.push(newIssue);
      return { data: newIssue };
    }
    
    if (url.includes('/issues/') && method === 'patch') {
      const id = parseInt(url.split('/').pop());
      const updates = JSON.parse(data);
      mockIssues = mockIssues.map(i => i.id === id ? { ...i, ...updates } : i);
      return { data: mockIssues.find(i => i.id === id) };
    }

    return Promise.reject(error);
  }
);

export default api;
