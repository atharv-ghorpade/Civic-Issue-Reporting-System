import api from './api';

export const login = async (credentials) => {
  try {
    const params = new URLSearchParams();
    params.append('username', credentials.email.trim()); 
    params.append('password', credentials.password.trim());
    
    const response = await api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    // Trim all string data
    const trimmedData = {
      ...userData,
      email: userData.email.trim(),
      username: userData.username.trim(),
      password: userData.password.trim(),
      full_name: userData.full_name?.trim()
    };
    const response = await api.post('/auth/register', trimmedData);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Get User Profile Error:', error.response?.data || error.message);
    throw error;
  }
};

const authService = {
  login,
  register,
  getUserProfile,
};

export default authService;
