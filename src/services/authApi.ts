import { api, ApiResponse } from './api';

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'STUDENT' | 'COLLEGE' | 'COMPANY' | 'ADMIN';
  collegeName?: string;
  degree?: string;
  branch?: string;
  graduationYear?: number;
  companyName?: string;
  industry?: string;
}

export interface LoginPayload {
  identifier: string;
  password?: string;
  otp?: string;
}

export interface OtpPayload {
  identifier: string;
  purpose?: 'REGISTER' | 'LOGIN' | 'PASSWORD_RESET';
}

export interface VerifyOtpPayload {
  identifier: string;
  otp: string;
  purpose?: 'REGISTER' | 'LOGIN' | 'PASSWORD_RESET';
}

export const authApi = {
  register: (payload: RegisterPayload): Promise<ApiResponse> => {
    return api.post('/auth/register', payload);
  },

  login: (payload: LoginPayload): Promise<ApiResponse> => {
    return api.post('/auth/login', payload);
  },

  sendOtp: (payload: OtpPayload): Promise<ApiResponse> => {
    return api.post('/auth/send-otp', payload);
  },

  verifyOtp: (payload: VerifyOtpPayload): Promise<ApiResponse> => {
    return api.post('/auth/verify-otp', payload);
  },

  getMe: (): Promise<ApiResponse> => {
    return api.get('/auth/me');
  },

  logout: (): Promise<ApiResponse> => {
    return api.post('/auth/logout', {});
  }
};
