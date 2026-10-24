import { UserSession } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("bgverify_token") : null);
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errorBody.detail || "API request failed");
  }

  return res.json();
}

export const authApi = {
  login: async (email: string, password: string): Promise<UserSession> => {
    return apiRequest<UserSession>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  register: async (data: {
    email: string;
    password: string;
    full_name: string;
    role: "ADMIN" | "ORG_HR" | "CANDIDATE";
    organization_name?: string;
    phone?: string;
  }): Promise<{ user: any; token: UserSession }> => {
    return apiRequest<{ user: any; token: UserSession }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  getProfile: async (token: string): Promise<UserSession> => {
    return apiRequest<UserSession>("/auth/me", {}, token);
  },
};

export const dashboardApi = {
  getStats: async (): Promise<any> => {
    return apiRequest<any>("/dashboard/stats");
  },
  getRecentActivity: async (filter?: { search?: string; status?: string }): Promise<any> => {
    const params = new URLSearchParams();
    if (filter?.search) params.append("search", filter.search);
    if (filter?.status) params.append("status_filter", filter.status);
    return apiRequest<any>(`/dashboard/recent-activity?${params.toString()}`);
  },
};

export const orgApi = {
  list: async (): Promise<any[]> => {
    return apiRequest<any[]>("/organizations/");
  },
  create: async (data: { name: string; slug: string; domain?: string; quota?: number }): Promise<any> => {
    return apiRequest<any>("/organizations/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

export const creditsApi = {
  getBalance: async (): Promise<{ token_balance: number; cost_per_analysis: number }> => {
    return apiRequest<any>("/credits/balance");
  },
  purchase: async (package_id: string, tokens: number, amount_usd: number): Promise<any> => {
    return apiRequest<any>("/credits/purchase", {
      method: "POST",
      body: JSON.stringify({ package_id, tokens, amount_usd }),
    });
  },
  deduct: async (reason: string, cost: number = 1): Promise<any> => {
    return apiRequest<any>("/credits/deduct", {
      method: "POST",
      body: JSON.stringify({ reason, cost }),
    });
  },
};

