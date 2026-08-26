import { api, ApiResponse } from './api';

export interface CreateJobPayload {
  title: string;
  department?: string;
  location?: string;
  type?: string;
  experience?: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
}

export const companyApi = {
  getProfile: (): Promise<ApiResponse> => {
    return api.get('/companies/profile');
  },

  getJobs: (): Promise<ApiResponse> => {
    return api.get('/companies/jobs');
  },

  createJob: (payload: CreateJobPayload): Promise<ApiResponse> => {
    return api.post('/companies/jobs', payload);
  },

  getJobApplications: (jobId: string): Promise<ApiResponse> => {
    return api.get(`/companies/jobs/${jobId}/applications`);
  },

  updateApplicationStatus: (applicationId: string, status: string, notes?: string): Promise<ApiResponse> => {
    return api.put(`/companies/applications/${applicationId}/status`, { status, notes });
  }
};
