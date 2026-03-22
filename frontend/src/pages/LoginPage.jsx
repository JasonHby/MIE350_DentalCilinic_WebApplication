import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const user = await login(username, password)
      onLogin(user)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="eyebrow">Clinic access</p>
        <h1>Sign in to DentalCare IMS</h1>
        <p className="login-copy">Use one of the seeded demo accounts to explore the system.</p>
        <form onSubmit={handleSubmit} className="stack-form">
          <label>
            Username
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="inline-error">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="credential-list">
          <span>`receptionist / dental123`</span>
          <span>`dentist / dental456`</span>
          <span>`admin / dental789`</span>
        </div>
      </div>
    </div>
  )
}
