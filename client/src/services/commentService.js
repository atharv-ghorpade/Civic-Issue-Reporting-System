import api from './api';

export const getIssueComments = async (issueId) => {
  try {
    const response = await api.get(`/issues/${issueId}/comments`);
    return response.data;
  } catch (error) {
    console.error(`Fetch Comments for Issue ${issueId} Error:`, error.response?.data || error.message);
    throw error;
  }
};

export const addComment = async (issueId, commentData) => {
  try {
    const response = await api.post(`/issues/${issueId}/comments`, {
      ...commentData,
      issue_id: parseInt(issueId),
    });
    return response.data;
  } catch (error) {
    console.error(`Add Comment for Issue ${issueId} Error:`, error.response?.data || error.message);
    throw error;
  }
};

const commentService = {
  getIssueComments,
  addComment,
};

export default commentService;
