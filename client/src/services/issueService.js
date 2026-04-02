import api from './api';

export const getAllIssues = async () => {
  try {
    const response = await api.get('/issues');
    return response.data;
  } catch (error) {
    console.error('Fetch All Issues Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getMyIssues = async () => {
  try {
    const response = await api.get('/issues/my');
    return response.data;
  } catch (error) {
    console.error('Fetch My Issues Error:', error.response?.data || error.message);
    throw error;
  }
};

export const createIssue = async (issueData) => {
  try {
    const formData = new FormData();
    formData.append('title', issueData.title);
    formData.append('description', issueData.description);
    formData.append('location', issueData.location);
    formData.append('category', issueData.category);
    formData.append('priority', issueData.priority || 'medium');
    
    if (issueData.image) {
      formData.append('image', issueData.image);
    }

    const response = await api.post('/issues/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create Issue Error:', error.response?.data || error.message);
    throw error;
  }
};

export const getIssueById = async (id) => {
  try {
    const response = await api.get(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fetch Issue ${id} Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateIssueStatus = async (id, statusData) => {
  try {
    const response = await api.put(`/issues/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error(`Update Issue ${id} Status Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const assignIssue = async (id, assignmentData) => {
  try {
    // assigned_to_id is a query param in the backend
    const response = await api.put(`/issues/${id}/assign`, null, {
      params: {
        assigned_to_id: assignmentData.assigned_to
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Assign Issue ${id} Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const deleteIssue = async (id) => {
  try {
    const response = await api.delete(`/issues/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Delete Issue ${id} Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const updateIssue = async (id, updateBody) => {
  try {
    const response = await api.put(`/issues/${id}`, updateBody);
    return response.data;
  } catch (error) {
    console.error(`Update Issue ${id} Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const getIssueHistory = async (id) => {
  try {
    const response = await api.get(`/issues/${id}/history`);
    return response.data;
  } catch (error) {
    console.error(`Fetch Issue ${id} History Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const uploadIssueImage = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/issues/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Upload Issue ${id} Image Error:`, error.response?.data || error.message);
    throw error;
  }
};

const issueService = {
  getAllIssues,
  getMyIssues,
  createIssue,
  getIssueById,
  updateIssueStatus,
  assignIssue,
  deleteIssue,
  updateIssue,
  getIssueHistory,
  uploadIssueImage,
};

export default issueService;
