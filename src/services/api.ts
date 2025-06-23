import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export interface Portfolio {
  id: string;
  personalInfo: any;
  projects: any[];
  experiences: any[];
  education: any[];
  skills: any[];
  theme: any;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  name: string;
  preview: string;
  category: string;
  isPremium: boolean;
}

export interface Analytics {
  views: number;
  uniqueVisitors: number;
  bounceRate: string;
  avgTimeOnSite: string;
  topPages: Array<{ page: string; views: number }>;
  recentVisits: Array<{ date: string; visits: number }>;
}

// Portfolio API
export const portfolioAPI = {
  save: async (portfolioData: any): Promise<{ success: boolean; id: string }> => {
    const response = await api.post('/portfolios', portfolioData);
    return response.data;
  },

  get: async (id: string): Promise<Portfolio> => {
    const response = await api.get(`/portfolios/${id}`);
    return response.data;
  },

  getAll: async (): Promise<Portfolio[]> => {
    const response = await api.get('/portfolios');
    return response.data;
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/portfolios/${id}`);
    return response.data;
  },

  generate: async (portfolioData: any, templateId: string): Promise<{ success: boolean; html: string; downloadUrl: string }> => {
    const response = await api.post('/generate', { portfolioData, templateId });
    return response.data;
  }
};

// Template API
export const templateAPI = {
  getAll: async (category?: string, premium?: boolean): Promise<Template[]> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (premium !== undefined) params.append('premium', premium.toString());
    
    const response = await api.get(`/templates?${params.toString()}`);
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  image: async (file: File): Promise<{ success: boolean; url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  get: async (portfolioId: string): Promise<Analytics> => {
    const response = await api.get(`/analytics/${portfolioId}`);
    return response.data;
  }
};

export default api;