import { Link } from 'react-router-dom'

export default function PublicHome() {
  return (
    <div className="public-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">MIE350 Team 12</p>
          <h1>DentalCare IMS</h1>
          <p>
            A full-stack dental clinic prototype for patient records, appointment scheduling,
            visit documentation, inventory tracking, and billing.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" to="/login">
              Open Application
            </Link>
            <a className="ghost-button" href="#features">
              See Features
            </a>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-stat">
            <strong>9</strong>
            <span>Backend modules</span>
          </div>
          <div className="hero-stat">
            <strong>REST</strong>
            <span>Spring Boot API</span>
          </div>
          <div className="hero-stat">
            <strong>React</strong>
            <span>Single-page frontend</span>
          </div>
        </div>
      </section>

      <section className="feature-section" id="features">
        <article className="feature-card">
          <h2>Patient management</h2>
          <p>Register patients, inspect their history, and update records from one view.</p>
        </article>
        <article className="feature-card">
          <h2>Scheduling</h2>
          <p>Track dentist calendars, avoid time conflicts, and launch visits from the schedule.</p>
        </article>
        <article className="feature-card">
          <h2>Clinical workflow</h2>
          <p>Record visits, add services, deduct inventory automatically, and generate bills.</p>
        </article>
      </section>
    </div>
  )
}
