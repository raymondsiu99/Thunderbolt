import axios from 'axios';

// Base API URL - adjust as needed
const API_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('authToken');
    },
};

// Admin API
export const adminAPI = {
    // Dashboard Stats
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Activity Logs
    getActivityLogs: async (limit: number = 10) => {
        const response = await api.get('/admin/activity', { params: { limit } });
        return response.data;
    },

    logActivity: async (action: string, user_id: number, details?: string) => {
        const response = await api.post('/admin/activity', { action, user_id, details });
        return response.data;
    },

    // User Management
    getAllUsers: async (role?: string) => {
        const params = role ? { role } : {};
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    getUser: async (id: number) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    createUser: async (userData: any) => {
        const response = await api.post('/admin/users', userData);
        return response.data;
    },

    updateUser: async (id: number, userData: any) => {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id: number) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Reports
    getJobsReport: async (startDate?: string, endDate?: string) => {
        const params: any = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const response = await api.get('/admin/reports/jobs', { params });
        return response.data;
    },

    getDriversReport: async () => {
        const response = await api.get('/admin/reports/drivers');
        return response.data;
    },

    getRevenueReport: async (period: string = 'month') => {
        const response = await api.get('/admin/reports/revenue', { params: { period } });
        return response.data;
    },
};

// Jobs API
export const jobsAPI = {
    getAll: async () => {
        const response = await api.get('/jobs');
        return response.data;
    },

    getOne: async (id: number) => {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    },

    create: async (jobData: any) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },

    update: async (id: number, jobData: any) => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    },
};

export default api;
