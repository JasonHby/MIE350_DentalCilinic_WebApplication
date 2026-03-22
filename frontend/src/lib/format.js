export function formatDate(value) {
  if (!value) return '-'
  const date = new Date(value.includes('T') ? value : `${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatTime(value) {
  if (!value) return '-'
  const [hour = '00', minute = '00'] = value.split(':')
  const parsedHour = Number.parseInt(hour, 10)
  const ampm = parsedHour >= 12 ? 'PM' : 'AM'
  const displayHour = parsedHour % 12 || 12
  return `${displayHour}:${minute} ${ampm}`
}

export function formatCurrency(value) {
  const amount = Number(value || 0)
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })
}

export function normalizeDateInput(value) {
  if (!value) return ''
  return value.slice(0, 10)
}

export function normalizeTimeInput(value) {
  if (!value) return ''
  return value.slice(0, 5)
}

export function statusClass(status) {
  return String(status || 'unknown').toLowerCase().replace(/\s+/g, '-')
}
