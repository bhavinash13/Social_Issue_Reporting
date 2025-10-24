import api from './api';

export const reportService = {
  async getAllReports(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.location) params.append('location', filters.location);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/reports?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('getAllReports error:', error);
      throw error;
    }
  },

  async getReportById(reportId) {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('getReportById error:', error);
      throw error;
    }
  },

  async getMyReports() {
    try {
      const response = await api.get('/reports/my');
      return response.data;
    } catch (error) {
      console.error('getMyReports error:', error);
      throw error;
    }
  },

  async createReport(formData) {
    try {
      const response = await api.post('/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('createReport error:', error);
      throw error;
    }
  },

  async updateReportStatus(reportId, status) {
    try {
      const response = await api.patch(`/reports/${reportId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('updateReportStatus error:', error);
      throw error;
    }
  },

  async deleteReport(reportId) {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('deleteReport error:', error);
      throw error;
    }
  },

  async addComment(reportId, content) {
    try {
      const response = await api.post(`/reports/${reportId}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error('addComment error:', error);
      throw error;
    }
  },

  async updateComment(commentId, content) {
    try {
      const response = await api.patch(`/reports/comments/${commentId}`, { content });
      return response.data;
    } catch (error) {
      console.error('updateComment error:', error);
      throw error;
    }
  },

  async deleteComment(commentId) {
    try {
      const response = await api.delete(`/reports/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error('deleteComment error:', error);
      throw error;
    }
  }
};