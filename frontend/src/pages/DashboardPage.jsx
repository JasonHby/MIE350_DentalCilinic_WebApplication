import { useEffect, useState } from 'react'
import { getDashboardStats } from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState } from '../components/Common'
import { formatCurrency } from '../lib/format'

export default function DashboardPage() {
  const { notify } = useAppContext()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const data = await getDashboardStats()
        if (!ignore) setStats(data)
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          notify(err.message, 'error')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    load()
    return () => {
      ignore = true
    }
  }, [notify])

  if (loading) return <div className="loading-card">Loading dashboard...</div>
  if (error && !stats) return <EmptyState title="Dashboard unavailable" body={error} />

  const metricCards = [
    ['Monthly revenue', formatCurrency(stats.monthlyRevenue)],
    ["Today's appointments", stats.todayAppointments],
    ['Total patients', stats.totalPatients],
    ['Low stock items', stats.lowStockCount],
    ['Pending bills', stats.pendingBills],
  ]

  return (
    <div className="page-stack">
      <section className="card-grid">
        {metricCards.map(([label, value]) => (
          <article key={label} className="metric-card">
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>
      <section className="panel">
        <div className="panel-header">
          <h2>Monthly trend</h2>
          <p>Revenue and appointment volume over the last six months.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Appointments</th>
              </tr>
            </thead>
            <tbody>
              {(stats.monthlyTrend || []).map((point) => (
                <tr key={point.month}>
                  <td>{point.month}</td>
                  <td>{formatCurrency(point.revenue)}</td>
                  <td>{point.appointments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
