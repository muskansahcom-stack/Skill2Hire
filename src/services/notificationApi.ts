import { api, ApiResponse } from './api';

export const notificationApi = {
  getNotifications: (): Promise<ApiResponse> => {
    return api.get('/notifications');
  }
};
