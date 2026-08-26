import { api, ApiResponse } from './api';

export const jobApi = {
  getJobs: (params?: { search?: string; location?: string; type?: string }): Promise<ApiResponse> => {
    const query = new URLSearchParams(params as any).toString();
    return api.get(`/jobs${query ? `?${query}` : ''}`);
  },

  getJobById: (id: string): Promise<ApiResponse> => {
    return api.get(`/jobs/${id}`);
  },

  applyForJob: (id: string, coverLetter?: string): Promise<ApiResponse> => {
    return api.post(`/jobs/${id}/apply`, { coverLetter });
  }
};
