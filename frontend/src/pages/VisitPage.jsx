import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  completeVisit,
  createService,
  createVisit,
  deleteService,
  getAppointment,
  getInventory,
  getPatient,
  getServicesByVisit,
  getVisitByAppointment,
  updateAppointment,
} from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState, StatusBadge } from '../components/Common'
import { emptyServiceForm, emptyVisitForm } from '../lib/forms'
import { formatCurrency, formatDate, formatDateTime, formatTime } from '../lib/format'

export default function VisitPage() {
  const { appointmentId } = useParams()
  const { notify } = useAppContext()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState(null)
  const [patient, setPatient] = useState(null)
  const [visit, setVisit] = useState(null)
  const [services, setServices] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [visitForm, setVisitForm] = useState(emptyVisitForm())
  const [serviceForm, setServiceForm] = useState(emptyServiceForm())

  async function loadVisitWorkspace() {
    setLoading(true)
    try {
      const appointmentData = await getAppointment(appointmentId)
      const [patientData, inventoryData] = await Promise.all([
        getPatient(appointmentData.patientId),
        getInventory(),
      ])
      setAppointment(appointmentData)
      setPatient(patientData)
      setInventoryItems(inventoryData)
      try {
        const visitData = await getVisitByAppointment(appointmentId)
        setVisit(visitData)
        setVisitForm({
          chiefComplaint: visitData.chiefComplaint || '',
          findings: visitData.findings || '',
          diagnosis: visitData.diagnosis || '',
          treatmentPlan: visitData.treatmentPlan || '',
        })
        setServices(await getServicesByVisit(visitData.visitId))
      } catch {
        setVisit(null)
        setServices([])
      }
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisitWorkspace()
  }, [appointmentId])

  async function startVisit() {
    try {
      await updateAppointment(appointmentId, { status: 'InProgress' })
      notify('Visit started.')
      loadVisitWorkspace()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function saveVisitRecord(event) {
    event.preventDefault()
    try {
      const created = await createVisit({
        appointmentId: Number(appointmentId),
        chiefComplaint: visitForm.chiefComplaint || null,
        findings: visitForm.findings || null,
        diagnosis: visitForm.diagnosis || null,
        treatmentPlan: visitForm.treatmentPlan || null,
      })
      setVisit(created)
      setServices(await getServicesByVisit(created.visitId))
      notify('Visit record saved.')
      loadVisitWorkspace()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function addServiceRow(event) {
    event.preventDefault()
    if (!visit) {
      notify('Save the visit record first.', 'error')
      return
    }
    try {
      await createService({
        visitId: visit.visitId,
        serviceName: serviceForm.serviceName,
        description: serviceForm.description || null,
        unitCost: Number(serviceForm.unitCost),
        quantity: Number(serviceForm.quantity),
        linkedInventoryItemId: serviceForm.linkedInventoryItemId ? Number(serviceForm.linkedInventoryItemId) : null,
      })
      notify('Service added.')
      setServiceForm(emptyServiceForm())
      loadVisitWorkspace()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function removeService(serviceId) {
    if (!window.confirm('Remove this service?')) return
    try {
      await deleteService(serviceId)
      notify('Service removed.')
      loadVisitWorkspace()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function finishVisit() {
    if (!window.confirm('Complete this visit and generate a bill?')) return
    try {
      const result = await completeVisit(appointmentId)
      notify(result.message || 'Visit completed.')
      navigate('/schedule')
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  if (loading) return <div className="loading-card">Loading visit workspace...</div>
  if (!appointment || !patient) return <EmptyState title="Visit workspace unavailable" />

  const serviceTotal = services.reduce(
    (sum, service) => sum + Number(service.unitCost || 0) * Number(service.quantity || 1),
    0,
  )

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Appointment summary</h2>
            <p>
              {patient.firstName} {patient.lastName} · {formatDate(appointment.appointmentDate)} ·{' '}
              {formatTime(appointment.appointmentTime)}
            </p>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        <div className="detail-grid compact-gap">
          <article className="subpanel">
            <h3>Patient</h3>
            <p><strong>Name:</strong> {patient.firstName} {patient.lastName}</p>
            <p><strong>DOB:</strong> {formatDate(patient.dateOfBirth)}</p>
            <p><strong>Medical history:</strong> {patient.medicalHistory || 'None recorded'}</p>
          </article>
          <article className="subpanel">
            <h3>Appointment</h3>
            <p>
              <strong>Dentist:</strong>{' '}
              {appointment.dentist
                ? `Dr. ${appointment.dentist.firstName} ${appointment.dentist.lastName}`
                : `Dentist #${appointment.dentistId}`}
            </p>
            <p><strong>Duration:</strong> {appointment.duration} minutes</p>
            <p><strong>Notes:</strong> {appointment.notes || '-'}</p>
          </article>
        </div>
        {appointment.status === 'Scheduled' ? (
          <div className="inline-actions">
            <button type="button" className="primary-button" onClick={startVisit}>
              Start visit
            </button>
          </div>
        ) : null}
      </section>

      <section className="detail-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Visit record</h3>
            <p>Capture clinical notes before adding services.</p>
          </div>
          {visit ? (
            <div className="visit-summary">
              <p><strong>Chief complaint:</strong> {visit.chiefComplaint || '-'}</p>
              <p><strong>Findings:</strong> {visit.findings || '-'}</p>
              <p><strong>Diagnosis:</strong> {visit.diagnosis || '-'}</p>
              <p><strong>Treatment plan:</strong> {visit.treatmentPlan || '-'}</p>
              <p className="muted-copy">Recorded {formatDateTime(visit.createdAt)}</p>
            </div>
          ) : (
            <form className="modal-form" onSubmit={saveVisitRecord}>
              <label>
                Chief complaint
                <textarea
                  rows="3"
                  value={visitForm.chiefComplaint}
                  onChange={(event) => setVisitForm({ ...visitForm, chiefComplaint: event.target.value })}
                />
              </label>
              <label>
                Findings
                <textarea
                  rows="3"
                  value={visitForm.findings}
                  onChange={(event) => setVisitForm({ ...visitForm, findings: event.target.value })}
                />
              </label>
              <label>
                Diagnosis
                <input
                  value={visitForm.diagnosis}
                  onChange={(event) => setVisitForm({ ...visitForm, diagnosis: event.target.value })}
                />
              </label>
              <label>
                Treatment plan
                <textarea
                  rows="3"
                  value={visitForm.treatmentPlan}
                  onChange={(event) => setVisitForm({ ...visitForm, treatmentPlan: event.target.value })}
                />
              </label>
              <button type="submit" className="primary-button">
                Save visit record
              </button>
            </form>
          )}
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Clinical services</h3>
            <p>Itemize procedures and optionally link inventory deductions.</p>
          </div>
          {visit ? (
            <>
              <form className="modal-form compact-form" onSubmit={addServiceRow}>
                <div className="field-grid">
                  <label>
                    Service name
                    <input
                      value={serviceForm.serviceName}
                      onChange={(event) => setServiceForm({ ...serviceForm, serviceName: event.target.value })}
                    />
                  </label>
                  <label>
                    Unit cost
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={serviceForm.unitCost}
                      onChange={(event) => setServiceForm({ ...serviceForm, unitCost: event.target.value })}
                    />
                  </label>
                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      value={serviceForm.quantity}
                      onChange={(event) => setServiceForm({ ...serviceForm, quantity: event.target.value })}
                    />
                  </label>
                  <label>
                    Linked inventory
                    <select
                      value={serviceForm.linkedInventoryItemId}
                      onChange={(event) => setServiceForm({ ...serviceForm, linkedInventoryItemId: event.target.value })}
                    >
                      <option value="">None</option>
                      {inventoryItems.map((item) => (
                        <option key={item.itemId} value={item.itemId}>
                          {item.itemName} (qty {item.quantity})
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field-span">
                    Description
                    <input
                      value={serviceForm.description}
                      onChange={(event) => setServiceForm({ ...serviceForm, description: event.target.value })}
                    />
                  </label>
                </div>
                <button type="submit" className="primary-button">
                  Add service
                </button>
              </form>

              {services.length === 0 ? (
                <p className="muted-copy">No services added yet.</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Description</th>
                        <th>Unit cost</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.serviceId}>
                          <td>{service.serviceName}</td>
                          <td>{service.description || '-'}</td>
                          <td>{formatCurrency(service.unitCost)}</td>
                          <td>{service.quantity || 1}</td>
                          <td>{formatCurrency((service.unitCost || 0) * (service.quantity || 1))}</td>
                          <td>
                            {appointment.status !== 'Completed' ? (
                              <button type="button" className="danger-button" onClick={() => removeService(service.serviceId)}>
                                Remove
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="total-strip">
                <strong>Total</strong>
                <span>{formatCurrency(serviceTotal)}</span>
              </div>

              {appointment.status !== 'Completed' ? (
                <button type="button" className="primary-button" onClick={finishVisit}>
                  Complete visit
                </button>
              ) : null}
            </>
          ) : (
            <p className="muted-copy">Save the visit record first to add services.</p>
          )}
        </article>
      </section>
    </div>
  )
}
