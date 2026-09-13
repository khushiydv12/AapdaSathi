const API_BASE_URL = 'http://localhost:5000/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/* =========================================================
   HEALTH CHECK
   ========================================================= */

export async function getHealth() {
  return request<{
    status: string;
    service: string;
    mongo: boolean;
    timestamp: string;
  }>('/health');
}

/* =========================================================
   INVENTORY
   ========================================================= */

export interface BackendInventoryItem {
  id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  source: string;
}

export async function getInventory() {
  return request<{
    success: boolean;
    data: BackendInventoryItem[];
  }>('/relief/inventory');
}

/* =========================================================
   RELIEF REQUESTS
   ========================================================= */

export interface BackendReliefRequest {
  id: string;
  item: string;
  category: string;
  quantity: number;
  unit: string;
  state: string;
  district: string;
  population: number;
  urgency: number;
  shortage: number;
  accessibility: number;
  vulnerability: number;
  priority: number;
  status: string;
  createdAt: string;
}

export async function getReliefRequests() {
  return request<{
    success: boolean;
    data: BackendReliefRequest[];
  }>('/relief/requests');
}

export async function createReliefRequest(data: {
  item: string;
  category: string;
  quantity: number;
  unit: string;
  state: string;
  district: string;
  population: number;
  urgency: number;
  shortage: number;
  accessibility: number;
  vulnerability: number;
}) {
  return request<{
    success: boolean;
    data: BackendReliefRequest;
  }>('/relief/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* =========================================================
   AI PRIORITY SCORE
   ========================================================= */

export async function calculatePriorityScore(data: {
  population: number;
  urgency: number;
  shortage: number;
  accessibility: number;
  vulnerability: number;
}) {
  return request<{
    success: boolean;
    score: number;
    priority: string;
  }>('/relief/priority-score', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* =========================================================
   AI NEED → RELIEF MATCHING
   ========================================================= */

export async function matchReliefNeed(data: {
  category: string;
  quantity: number;
}) {
  return request<{
    success: boolean;
    matched: boolean;
    message?: string;
    data?: {
      source: string;
      item: string;
      available: number;
      requested: number;
      allocated: number;
      matchScore: number;
    };
  }>('/relief/match-need', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* =========================================================
   DELIVERIES
   ========================================================= */

export interface BackendDelivery {
  id: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

export async function getDeliveries() {
  return request<{
    success: boolean;
    data: BackendDelivery[];
  }>('/relief/deliveries');
}

export async function createDelivery(data: Record<string, unknown>) {
  return request<{
    success: boolean;
    data: BackendDelivery;
  }>('/relief/deliveries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateDelivery(
  id: string,
  data: Record<string, unknown>
) {
  return request<{
    success: boolean;
    data: BackendDelivery;
  }>(`/relief/deliveries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/* =========================================================
   ESSENTIAL COVERAGE SCORE
   ========================================================= */

export async function calculateCoverageScore(data: {
  food: number;
  water: number;
  medicine: number;
  shelter: number;
  sanitation: number;
}) {
  return request<{
    success: boolean;
    score: number;
  }>('/relief/coverage-score', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/* =========================================================
   AI DEMAND FORECAST
   ========================================================= */

export async function demandForecast(data: Record<string, unknown>) {
  return request<{
    success: boolean;
    [key: string]: unknown;
  }>('/relief/demand-forecast', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}