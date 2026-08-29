import { CreateSurpriseData, Surprise, SurpriseContent, Occasion } from '../types';
import { getToken } from '../utils/auth';

const API_URL = import.meta.env.VITE_API_URL || '';
const BASE = `${API_URL}/api`;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });
  
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail || 'Something went wrong');
  }
  
  if (res.status === 204) {
    return {} as T;
  }
  
  return res.json();
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function createSurprise(data: CreateSurpriseData) {
  return request<{ public_token: string; recipient_name: string; title: string; unlock_at: string; created_at: string }>(
    '/surprises',
    { method: 'POST', body: JSON.stringify(data) },
  );
}

export async function getSurprise(token: string) {
  return request<Surprise>(`/surprises/${token}`);
}

export async function getSurpriseContent(token: string) {
  return request<SurpriseContent>(`/surprises/${token}/content`);
}

export async function getOccasions() {
  return request<Occasion[]>('/occasions');
}

export async function getServerTime() {
  const data = await request<{ server_time: string }>('/server-time');
  return data.server_time;
}

export const uploadMedia = async (file: File): Promise<{ media_url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const headers: HeadersInit = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
    headers,
  });

  if (!response.ok) {
    let errorMsg = 'Failed to upload media';
    try {
      const errorData = await response.json();
      errorMsg = errorData.detail || errorMsg;
    } catch {
      // Ignore
    }
    throw new ApiError(response.status, errorMsg);
  }

  return response.json();
};

// --- Auth & Dashboard ---

export async function register(email: string, password: string) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  // OAuth2PasswordRequestForm needs x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append('username', email);
  formData.append('password', password);
  
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  });
  
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.detail || 'Login failed');
  }
  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function googleAuth(token: string) {
  return request<{ access_token: string; token_type: string }>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export async function getDashboardSurprises() {
  return request<any[]>('/dashboard/surprises');
}

export async function deleteSurprise(id: number) {
  return request(`/dashboard/surprises/${id}`, { method: 'DELETE' });
}
