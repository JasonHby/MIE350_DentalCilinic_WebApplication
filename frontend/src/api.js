const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function joinUrl(path) {
  const base = API_BASE.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

function withQuery(path, params = {}) {
  const url = new URL(joinUrl(path))
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })
  return url.toString()
}

async function parseResponse(res) {
  if (res.status === 204) {
    return null
  }
  return res.json().catch(() => ({}))
}

export async function apiRequest(path, options = {}) {
  const isAbsolute = /^https?:\/\//.test(path)
  const url = isAbsolute ? path : joinUrl(path)
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  const data = await parseResponse(res)
  if (!res.ok) {
    throw new Error(data.message || data.error || `HTTP ${res.status}`)
  }
  return data
}

function ensureSeconds(time) {
  if (!time) return time
  return /^\d{2}:\d{2}$/.test(time) ? `${time}:00` : time
}

function appointmentRequestBody(payload = {}, fallback = {}) {
  return {
    patientId: payload.patientId ?? fallback.patientId ?? null,
    dentistId: payload.dentistId ?? fallback.dentistId ?? null,
    appointmentDate: payload.appointmentDate ?? fallback.appointmentDate ?? null,
    appointmentTime: ensureSeconds(payload.appointmentTime ?? fallback.appointmentTime ?? null),
    duration: payload.duration ?? fallback.duration ?? null,
    status: payload.status ?? fallback.status ?? null,
    notes: payload.notes ?? fallback.notes ?? null,
  }
}

export function login(username, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function getDashboardStats() {
  return apiRequest('/api/dashboard/stats')
}

export function getPatients() {
  return apiRequest('/api/patients')
}

export function getPatient(id) {
  return apiRequest(`/api/patients/${id}`)
}

export function createPatient(payload) {
  return apiRequest('/api/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updatePatient(id, payload) {
  return apiRequest(`/api/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deletePatient(id) {
  return apiRequest(`/api/patients/${id}`, {
    method: 'DELETE',
  })
}

export function getDentists() {
  return apiRequest('/api/dentists')
}

export function getAppointmentsByPatient(patientId) {
  return apiRequest(`/api/appointments/patient/${patientId}`)
}

export function getAppointmentsByDentist(dentistId, date) {
  return apiRequest(withQuery(`/api/appointments/dentist/${dentistId}`, { date }))
}

export function getAppointment(id) {
  return apiRequest(`/api/appointments/${id}`)
}

export function createAppointment(payload) {
  return apiRequest('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentRequestBody(payload)),
  })
}

export function updateAppointment(id, payload, currentAppointment = {}) {
  return apiRequest(`/api/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointmentRequestBody(payload, currentAppointment)),
  })
}

export function getVisitByAppointment(appointmentId) {
  return apiRequest(`/api/visits/${appointmentId}`)
}

export function createVisit(payload) {
  return apiRequest('/api/visits', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function completeVisit(appointmentId) {
  return apiRequest(`/api/visits/${appointmentId}/complete`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

export function getServicesByVisit(visitId) {
  return apiRequest(`/api/services/visit/${visitId}`)
}

export function createService(payload) {
  return apiRequest('/api/services', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function deleteService(id) {
  return apiRequest(`/api/services/${id}`, {
    method: 'DELETE',
  })
}

export function getBills(patientId) {
  if (patientId) {
    return apiRequest(`/api/billing/patient/${patientId}`)
  }
  return apiRequest('/api/billing')
}

export function createBill(payload) {
  return apiRequest('/api/billing', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateBill(id, payload) {
  return apiRequest(`/api/billing/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getInventory() {
  return apiRequest('/api/inventory')
}

export function createInventoryItem(payload) {
  return apiRequest('/api/inventory', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function restockInventory(id, payload) {
  return apiRequest(`/api/inventory/${id}/restock`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function consumeInventory(id, payload) {
  return apiRequest(`/api/inventory/${id}/consume`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getInventoryHistory({ itemId, startDate, endDate } = {}) {
  return apiRequest(withQuery('/api/inventory/history', { itemId, startDate, endDate }))
}
