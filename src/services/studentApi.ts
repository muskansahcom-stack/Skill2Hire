import { api, ApiResponse } from './api';

export interface ApplicationPayload {
  jobId: string;
  coverLetter?: string;
}

export const studentApi = {
  getProfile: (): Promise<ApiResponse> => {
    return api.get('/students/profile');
  },

  getSkills: (): Promise<ApiResponse> => {
    return api.get('/students/skills');
  },

  getApplications: (): Promise<ApiResponse> => {
    return api.get('/students/applications');
  },

  getRecommendations: (): Promise<ApiResponse> => {
    return api.get('/students/recommendations');
  },

  applyForJob: (jobId: string, payload?: { coverLetter?: string }): Promise<ApiResponse> => {
    return api.post(`/jobs/${jobId}/apply`, payload || {});
  }
};
