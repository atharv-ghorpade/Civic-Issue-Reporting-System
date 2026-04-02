import api from './api';

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Fetch Notifications Error:', error.response?.data || error.message);
    throw error;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error(`Mark Notification ${id} as Read Error:`, error.response?.data || error.message);
    throw error;
  }
};

const notificationService = {
  getNotifications,
  markAsRead,
};

export default notificationService;
