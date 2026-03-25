import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createAppointment,
  getAppointmentsByPatient,
  getBills,
  getDentists,
  getPatient,
  getVisitByAppointment,
  updateAppointment,
  updateBill,
} from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState, Modal, StatusBadge } from '../components/Common'
import { emptyAppointmentForm } from '../lib/forms'
import { formatCurrency, formatDate, formatTime, normalizeDateInput, normalizeTimeInput } from '../lib/format'

export default function PatientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { notify } = useAppContext()
  const [patient, setPatient] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [bills, setBills] = useState([])
  const [visitRecords, setVisitRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [appointmentError, setAppointmentError] = useState('')
  const [bookingForm, setBookingForm] = useState(emptyAppointmentForm())
  const [dentists, setDentists] = useState([])
  const [editingAppointmentId, setEditingAppointmentId] = useState(null)

  async function loadDetail() {
    setLoading(true)
    try {
      const [patientData, appointmentData, billData, dentistData] = await Promise.all([
        getPatient(id),
        getAppointmentsByPatient(id),
        getBills(id),
        getDentists(),
      ])
      setPatient(patientData)
      setAppointments(appointmentData)
      setBills(billData)
      setDentists(dentistData)
      const completed = appointmentData.filter((appointment) => appointment.status === 'Completed')
      const visits = await Promise.all(
        completed.map(async (appointment) => {
          try {
            const visit = await getVisitByAppointment(appointment.appointmentId)
            return { appointment, visit }
          } catch {
            return null
          }
        }),
      )
      setVisitRecords(visits.filter(Boolean))
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetail()
  }, [id])

  function openBooking() {
    setEditingAppointmentId(null)
    setAppointmentError('')
    setBookingForm(emptyAppointmentForm())
    setBookingOpen(true)
  }

  function openReschedule(appointment) {
    setEditingAppointmentId(appointment.appointmentId)
    setAppointmentError('')
    setBookingForm({
      dentistId: String(appointment.dentistId || ''),
      appointmentDate: normalizeDateInput(appointment.appointmentDate),
      appointmentTime: normalizeTimeInput(appointment.appointmentTime),
      duration: String(appointment.duration || 30),
      notes: appointment.notes || '',
    })
    setBookingOpen(true)
  }

  async function handleSaveAppointment(event) {
    event.preventDefault()
    setAppointmentError('')
    const payload = {
      patientId: Number(id),
      dentistId: Number(bookingForm.dentistId),
      appointmentDate: bookingForm.appointmentDate,
      appointmentTime: bookingForm.appointmentTime,
      duration: Number(bookingForm.duration || 30),
      notes: bookingForm.notes || null,
    }
    try {
      if (editingAppointmentId) {
        const currentAppointment = appointments.find((appointment) => appointment.appointmentId === editingAppointmentId)
        await updateAppointment(editingAppointmentId, payload, currentAppointment)
        notify('Appointment updated.')
      } else {
        await createAppointment(payload)
        notify('Appointment booked.')
      }
      setBookingOpen(false)
      loadDetail()
    } catch (err) {
      setAppointmentError(err.message)
    }
  }

  async function cancelAppointmentRecord(appointment) {
    if (!window.confirm('Cancel this appointment?')) return
    try {
      await updateAppointment(appointment.appointmentId, { status: 'Cancelled' }, appointment)
      notify('Appointment cancelled.')
      loadDetail()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function markBillPaid(bill) {
    try {
      await updateBill(bill.billId, {
        paymentStatus: 'Paid',
        amountPaid: bill.totalAmount,
        paymentMethod: bill.paymentMethod || 'Cash',
      })
      notify('Bill marked as paid.')
      loadDetail()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  if (loading) return <div className="loading-card">Loading patient profile...</div>
  if (!patient) return <EmptyState title="Patient not found" />

  return (
    <div className="page-stack">
      <section className="panel hero-panel-small">
        <div>
          <p className="eyebrow">Patient record</p>
          <h2>
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="muted-copy">Patient ID #{patient.patientId}</p>
        </div>
        <button type="button" className="primary-button" onClick={openBooking}>
          Book appointment
        </button>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <h3>Profile</h3>
          <dl className="detail-list">
            <div><dt>Date of birth</dt><dd>{formatDate(patient.dateOfBirth)}</dd></div>
            <div><dt>Gender</dt><dd>{patient.gender || '-'}</dd></div>
            <div><dt>Phone</dt><dd>{patient.phone || '-'}</dd></div>
            <div><dt>Email</dt><dd>{patient.email || '-'}</dd></div>
            <div><dt>Registered</dt><dd>{formatDate(patient.registrationDate)}</dd></div>
            <div className="detail-wide"><dt>Address</dt><dd>{patient.address || '-'}</dd></div>
            <div className="detail-wide"><dt>Medical history</dt><dd>{patient.medicalHistory || 'None recorded'}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <h3>Billing snapshot</h3>
          {bills.length === 0 ? (
            <p className="muted-copy">No billing records yet.</p>
          ) : (
            <div className="compact-list">
              {bills.slice(0, 4).map((bill) => (
                <div key={bill.billId} className="compact-item">
                  <div>
                    <strong>Bill #{bill.billId}</strong>
                    <span>{formatDate(bill.billingDate)} · {formatCurrency(bill.totalAmount)}</span>
                  </div>
                  <div className="compact-actions">
                    <StatusBadge status={bill.paymentStatus} />
                    {bill.paymentStatus !== 'Paid' ? (
                      <button type="button" className="ghost-button" onClick={() => markBillPaid(bill)}>
                        Mark paid
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="ghost-button align-start"
                onClick={() => navigate(`/billing?patientId=${patient.patientId}`)}
              >
                View all bills
              </button>
            </div>
          )}
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Appointments</h3>
          <p>Upcoming and historical appointments for this patient.</p>
        </div>
        {appointments.length === 0 ? (
          <EmptyState title="No appointments yet" body="Book the first appointment from this profile." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Dentist</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments
                  .slice()
                  .sort((left, right) => `${right.appointmentDate}${right.appointmentTime}`.localeCompare(`${left.appointmentDate}${left.appointmentTime}`))
                  .map((appointment) => (
                    <tr key={appointment.appointmentId}>
                      <td>{formatDate(appointment.appointmentDate)}</td>
                      <td>{formatTime(appointment.appointmentTime)}</td>
                      <td>
                        {appointment.dentistName
                          ? `Dr. ${appointment.dentistName}`
                          : appointment.dentist
                          ? `Dr. ${appointment.dentist.firstName} ${appointment.dentist.lastName}`
                          : `Dentist #${appointment.dentistId}`}
                      </td>
                      <td>{appointment.duration} min</td>
                      <td><StatusBadge status={appointment.status} /></td>
                      <td>{appointment.notes || '-'}</td>
                      <td className="row-actions">
                        {appointment.status === 'Scheduled' ? (
                          <>
                            <button type="button" className="ghost-button" onClick={() => openReschedule(appointment)}>
                              Reschedule
                            </button>
                            <button
                              type="button"
                              className="danger-button"
                              onClick={() => cancelAppointmentRecord(appointment)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : null}
                        {appointment.status === 'Completed' ? (
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => navigate(`/visits/${appointment.appointmentId}`)}
                          >
                            View visit
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Visit records</h3>
          <p>Clinical notes captured for completed appointments.</p>
        </div>
        {visitRecords.length === 0 ? (
          <p className="muted-copy">No visit records found.</p>
        ) : (
          <div className="visit-records">
            {visitRecords.map(({ appointment, visit }) => (
              <article key={visit.visitId} className="visit-card">
                <div className="visit-card-header">
                  <strong>{formatDate(appointment.appointmentDate)}</strong>
                  <span>
                    {visit.dentistName
                      ? `Dr. ${visit.dentistName}`
                      : appointment.dentistName
                      ? `Dr. ${appointment.dentistName}`
                      : appointment.dentist
                      ? `Dr. ${appointment.dentist.lastName}`
                      : `Dentist #${appointment.dentistId}`}
                  </span>
                </div>
                <p><strong>Chief complaint:</strong> {visit.chiefComplaint || '-'}</p>
                <p><strong>Findings:</strong> {visit.findings || '-'}</p>
                <p><strong>Diagnosis:</strong> {visit.diagnosis || '-'}</p>
                <p><strong>Treatment plan:</strong> {visit.treatmentPlan || '-'}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      {bookingOpen ? (
        <Modal title={editingAppointmentId ? 'Reschedule appointment' : 'Book appointment'} onClose={() => setBookingOpen(false)}>
          <form className="modal-form" onSubmit={handleSaveAppointment}>
            <div className="field-grid">
              <label>
                Dentist
                <select
                  value={bookingForm.dentistId}
                  onChange={(event) => setBookingForm({ ...bookingForm, dentistId: event.target.value })}
                >
                  <option value="">Select dentist</option>
                  {dentists.map((dentist) => (
                    <option key={dentist.dentistId} value={dentist.dentistId}>
                      Dr. {dentist.firstName} {dentist.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={bookingForm.appointmentDate}
                  onChange={(event) => setBookingForm({ ...bookingForm, appointmentDate: event.target.value })}
                />
              </label>
              <label>
                Time
                <input
                  type="time"
                  value={bookingForm.appointmentTime}
                  onChange={(event) => setBookingForm({ ...bookingForm, appointmentTime: event.target.value })}
                />
              </label>
              <label>
                Duration (min)
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={bookingForm.duration}
                  onChange={(event) => setBookingForm({ ...bookingForm, duration: event.target.value })}
                />
              </label>
            </div>
            <label>
              Notes
              <textarea
                rows="3"
                value={bookingForm.notes}
                onChange={(event) => setBookingForm({ ...bookingForm, notes: event.target.value })}
              />
            </label>
            {appointmentError ? <p className="inline-error">{appointmentError}</p> : null}
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setBookingOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                {editingAppointmentId ? 'Save changes' : 'Create appointment'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
