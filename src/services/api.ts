const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
}

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('s2h_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      return await response.json();
    } catch (error: any) {
      console.error(`[API GET ERROR] ${endpoint}:`, error);
      return { success: false, message: error.message || 'Network request failed' };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      return await response.json();
    } catch (error: any) {
      console.error(`[API POST ERROR] ${endpoint}:`, error);
      return { success: false, message: error.message || 'Network request failed' };
    }
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });
      return await response.json();
    } catch (error: any) {
      console.error(`[API PUT ERROR] ${endpoint}:`, error);
      return { success: false, message: error.message || 'Network request failed' };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await response.json();
    } catch (error: any) {
      console.error(`[API DELETE ERROR] ${endpoint}:`, error);
      return { success: false, message: error.message || 'Network request failed' };
    }
  }
}

export const api = new ApiClient();
