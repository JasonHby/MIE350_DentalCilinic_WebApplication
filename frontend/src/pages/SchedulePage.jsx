import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAppointmentsByDentist, getDentists } from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState, StatusBadge } from '../components/Common'
import { formatTime, normalizeDateInput } from '../lib/format'

export default function SchedulePage() {
  const [dentists, setDentists] = useState([])
  const [selectedDentistId, setSelectedDentistId] = useState('')
  const [selectedDate, setSelectedDate] = useState(normalizeDateInput(new Date().toISOString()))
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { notify } = useAppContext()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadDentistOptions() {
      try {
        const dentistData = await getDentists()
        setDentists(dentistData)
        if (dentistData[0]) setSelectedDentistId(String(dentistData[0].dentistId))
      } catch (err) {
        notify(err.message, 'error')
        setLoading(false)
      }
    }
    loadDentistOptions()
  }, [])

  useEffect(() => {
    if (!selectedDentistId) return
    setLoading(true)
    getAppointmentsByDentist(selectedDentistId, selectedDate)
      .then(setAppointments)
      .catch((err) => notify(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [selectedDentistId, selectedDate])

  function shiftDay(offset) {
    const next = new Date(`${selectedDate}T00:00:00`)
    next.setDate(next.getDate() + offset)
    setSelectedDate(normalizeDateInput(next.toISOString()))
  }

  return (
    <div className="page-stack">
      <section className="toolbar">
        <div className="toolbar-copy">
          <h2>Dentist schedule</h2>
          <p>Inspect daily appointment flow and jump into visit workspaces.</p>
        </div>
        <div className="toolbar-actions toolbar-wrap">
          <select value={selectedDentistId} onChange={(event) => setSelectedDentistId(event.target.value)}>
            {dentists.map((dentist) => (
              <option key={dentist.dentistId} value={dentist.dentistId}>
                Dr. {dentist.firstName} {dentist.lastName}
              </option>
            ))}
          </select>
          <div className="date-switcher">
            <button type="button" className="ghost-button" onClick={() => shiftDay(-1)}>
              Previous
            </button>
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
            <button type="button" className="ghost-button" onClick={() => shiftDay(1)}>
              Next
            </button>
          </div>
        </div>
      </section>
      <section className="panel">
        {loading ? (
          <div className="loading-card">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <EmptyState title="No appointments scheduled" body="This dentist has no appointments on the selected date." />
        ) : (
          <div className="schedule-grid">
            {appointments
              .slice()
              .sort((left, right) => left.appointmentTime.localeCompare(right.appointmentTime))
              .map((appointment) => (
                <article
                  key={appointment.appointmentId}
                  className={`appointment-card${appointment.status === 'Completed' ? ' appointment-complete' : ''}`}
                >
                  <div className="appointment-card-top">
                    <span>{formatTime(appointment.appointmentTime)}</span>
                    <StatusBadge status={appointment.status} />
                  </div>
                  <h3>
                    {appointment.patientName
                      ? appointment.patientName
                      : appointment.patient
                      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                      : `Patient #${appointment.patientId}`}
                  </h3>
                  <p>{appointment.duration} minutes</p>
                  {appointment.notes ? <p className="muted-copy">{appointment.notes}</p> : null}
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => navigate(`/visits/${appointment.appointmentId}`)}
                  >
                    Open visit
                  </button>
                </article>
              ))}
          </div>
        )}
      </section>
    </div>
  )
}
