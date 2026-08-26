import { api, ApiResponse } from './api';

export const collegeApi = {
  getProfile: (): Promise<ApiResponse> => {
    return api.get('/colleges/profile');
  },

  getStudents: (): Promise<ApiResponse> => {
    return api.get('/colleges/students');
  },

  getPlacements: (): Promise<ApiResponse> => {
    return api.get('/colleges/placements');
  }
};
