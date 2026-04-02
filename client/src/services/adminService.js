import api from './api';

export const getStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return response.data;
    } catch (error) {
        console.error('Fetch Stats Error:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get('/admin/users');
        return response.data;
    } catch (error) {
        console.error('Fetch All Users Error:', error.response?.data || error.message);
        throw error;
    }
};

export const verifyUser = async (userId) => {
    try {
        const response = await api.put(`/admin/users/${userId}/verify`);
        return response.data;
    } catch (error) {
        console.error(`Verify User ${userId} Error:`, error.response?.data || error.message);
        throw error;
    }
};

const adminService = {
    getStats,
    getAllUsers,
    verifyUser,
};

export default adminService;
