// In production, use relative URL since frontend is served by the same server
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

export function getAccessToken(): string | null {
  if (!accessToken) {
    accessToken = localStorage.getItem('accessToken');
  }
  return accessToken;
}

async function refreshToken(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAccessToken();
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // If unauthorized, try to refresh token
  if (response.status === 401 && token) {
    const newToken = await refreshToken();
    if (newToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// API Methods
export const api = {
  // Auth
  auth: {
    login: () => {
      window.location.href = `${API_BASE_URL}/auth/google`;
    },
    devLogin: (email: string) =>
      apiRequest<{ accessToken: string; user: any }>('/auth/dev-login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    logout: () => apiRequest('/auth/logout', { method: 'POST' }),
    me: () => apiRequest<any>('/auth/me'),
    refresh: refreshToken,
  },

  // Team Members
  teamMembers: {
    getAll: () => apiRequest<any[]>('/team-members'),
    getById: (id: string) => apiRequest<any>(`/team-members/${id}`),
    create: (data: any) =>
      apiRequest<any>('/team-members', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/team-members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      apiRequest(`/team-members/${id}`, { method: 'DELETE' }),
    updateAvatar: (id: string, data: { type: string; animal?: string; imageUrl?: string }) =>
      apiRequest<any>(`/team-members/${id}/avatar`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  // Surveys
  surveys: {
    getAll: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiRequest<{ data: any[]; pagination: any }>(`/surveys${query}`);
    },
    getCurrentWeek: () => apiRequest<any[]>('/surveys/current-week'),
    getMyResponses: () => apiRequest<any[]>('/surveys/my-responses'),
    getById: (id: string) => apiRequest<any>(`/surveys/${id}`),
    create: (data: any) =>
      apiRequest<any>('/surveys', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/surveys/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: string) => apiRequest(`/surveys/${id}`, { method: 'DELETE' }),
  },

  // Analytics
  analytics: {
    getTeamTrends: (params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiRequest<any[]>(`/analytics/team-trends${query}`);
    },
    getUserTrends: (userId: string, params?: Record<string, string>) => {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiRequest<any[]>(`/analytics/user-trends/${userId}${query}`);
    },
    getWeeklySummary: (week?: string) => {
      const query = week ? `?week=${week}` : '';
      return apiRequest<any>(`/analytics/weekly-summary${query}`);
    },
    getStressAlerts: (week?: string) => {
      const query = week ? `?week=${week}` : '';
      return apiRequest<any[]>(`/analytics/stress-alerts${query}`);
    },
    getCapacityDistribution: (week?: string) => {
      const query = week ? `?week=${week}` : '';
      return apiRequest<any>(`/analytics/capacity-distribution${query}`);
    },
  },
};
