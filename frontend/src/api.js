/**
 * Backend API base URL (from .env.development in dev).
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export function getApiUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

/**
 * Generic API request helper.
 */
export async function apiRequest(path, options = {}) {
  const url = getApiUrl(path)
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`)
  }
  return data
}

/** Login */
export async function login(username, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

/** Dashboard stats */
export async function getDashboardStats() {
  return apiRequest('/api/dashboard/stats')
}

/** Patient list */
export async function getPatients() {
  return apiRequest('/api/patients')
}
