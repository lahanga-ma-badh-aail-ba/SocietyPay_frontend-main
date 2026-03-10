import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🌐 API Configuration:', {
  baseURL: API_BASE_URL,
  env: import.meta.env.VITE_API_URL,
});

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fullURL: `${config.baseURL}${config.url}`,
      hasToken: !!token,
      headers: config.headers,
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      contentType: response.headers['content-type'],
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      contentType: error.response?.headers['content-type'],
      responseData: error.response?.data,
    });

    // Check if we're receiving HTML instead of JSON
    const contentType = error.response?.headers['content-type'];
    if (contentType?.includes('text/html')) {
      console.error('🚨 RECEIVED HTML INSTEAD OF JSON!');
      console.error('Common causes:');
      console.error('1. Backend route does not exist (404)');
      console.error('2. Backend is not running');
      console.error('3. Wrong API URL - Current:', API_BASE_URL);
      console.error('4. CORS blocking the request');
      
      // Try to get some of the HTML response
      if (typeof error.response?.data === 'string') {
        console.error('HTML Response Preview:', error.response.data.substring(0, 200));
      }
    }

    if (error.response?.status === 401) {
      console.warn('🔒 Unauthorized - Clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    
    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  flatId?: string | null;
  flat?: {
    id: string;
    flatNumber: string;
    ownerName: string;
    monthlyMaintenance: number;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'USER';
  flatId?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface Flat {
  id: string;
  flatNumber: string;
  ownerName: string;
  ownerEmail: string;
  monthlyMaintenance: number;
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}


// Auth API Functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    console.log('🔐 Calling register API');
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log('🔐 Calling login API with:', { email: data.email });
    const response = await api.post('/auth/login', data);
    console.log('✅ Login response received:', response.data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<{ user: User }> => {
    console.log('👤 Calling getProfile API');
    const response = await api.get('/auth/profile');
    console.log('✅ Profile response received:', response.data);
    return response.data;
  },

  // Get all users (Admin only)
  getAllUsers: async (): Promise<{ users: User[]; count: number }> => {
    console.log('👥 Calling getAllUsers API');
    const response = await api.get('/auth/users');
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (userId: string, data: Partial<User>): Promise<{ user: User }> => {
    console.log('✏️ Calling updateUser API for user:', userId);
    const response = await api.put(`/auth/users/${userId}`, data);
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId: string): Promise<{ message: string }> => {
    console.log('🗑️ Calling deleteUser API for user:', userId);
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },
};

export const flatAPI = {
  getAllFlats: async () => {
    const res = await api.get("/flats/all");
    return res.data as Flat[];
  },
};
