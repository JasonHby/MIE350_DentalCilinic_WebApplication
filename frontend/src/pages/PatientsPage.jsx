import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createPatient, deletePatient, getPatients, updatePatient } from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState, Modal } from '../components/Common'
import { emptyPatientForm } from '../lib/forms'
import { formatDate, normalizeDateInput } from '../lib/format'

export default function PatientsPage() {
  const { notify } = useAppContext()
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(emptyPatientForm())

  async function loadPatientsList() {
    setLoading(true)
    try {
      setPatients(await getPatients())
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatientsList()
  }, [])

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return patients
    return patients.filter((patient) =>
      `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query),
    )
  }, [patients, search])

  function openCreate() {
    setEditingPatient(null)
    setForm(emptyPatientForm())
    setModalOpen(true)
  }

  function openEdit(patient) {
    setEditingPatient(patient)
    setForm({
      firstName: patient.firstName || '',
      lastName: patient.lastName || '',
      dateOfBirth: normalizeDateInput(patient.dateOfBirth),
      gender: patient.gender || '',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      medicalHistory: patient.medicalHistory || '',
    })
    setModalOpen(true)
  }

  async function handleSave(event) {
    event.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) {
      notify('First name and last name are required.', 'error')
      return
    }
    setSaving(true)
    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      medicalHistory: form.medicalHistory || null,
    }
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.patientId, payload)
        notify('Patient updated.')
      } else {
        await createPatient(payload)
        notify('Patient created.')
      }
      setModalOpen(false)
      loadPatientsList()
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(patientId) {
    if (!window.confirm('Delete this patient record?')) return
    try {
      await deletePatient(patientId)
      notify('Patient deleted.')
      loadPatientsList()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <div className="page-stack">
      <section className="toolbar">
        <div className="toolbar-copy">
          <h2>Patient directory</h2>
          <p>Search, update, or register patient records.</p>
        </div>
        <div className="toolbar-actions">
          <input
            className="search-input"
            placeholder="Search by patient name"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="button" className="primary-button" onClick={openCreate}>
            New patient
          </button>
        </div>
      </section>

      <section className="panel">
        {loading ? (
          <div className="loading-card">Loading patients...</div>
        ) : filteredPatients.length === 0 ? (
          <EmptyState title="No patients found" body="Try another search or register a new patient." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Date of birth</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientId}>
                    <td>{patient.patientId}</td>
                    <td>
                      <Link className="inline-link" to={`/patients/${patient.patientId}`}>
                        {patient.firstName} {patient.lastName}
                      </Link>
                    </td>
                    <td>{formatDate(patient.dateOfBirth)}</td>
                    <td>{patient.gender || '-'}</td>
                    <td>{patient.phone || '-'}</td>
                    <td>{patient.email || '-'}</td>
                    <td>{formatDate(patient.registrationDate)}</td>
                    <td className="row-actions">
                      <button type="button" className="ghost-button" onClick={() => openEdit(patient)}>
                        Edit
                      </button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(patient.patientId)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen ? (
        <Modal title={editingPatient ? 'Edit patient' : 'New patient'} onClose={() => setModalOpen(false)}>
          <form className="modal-form" onSubmit={handleSave}>
            <div className="field-grid">
              <label>
                First name
                <input
                  value={form.firstName}
                  onChange={(event) => setForm({ ...form, firstName: event.target.value })}
                />
              </label>
              <label>
                Last name
                <input
                  value={form.lastName}
                  onChange={(event) => setForm({ ...form, lastName: event.target.value })}
                />
              </label>
              <label>
                Date of birth
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) => setForm({ ...form, dateOfBirth: event.target.value })}
                />
              </label>
              <label>
                Gender
                <input
                  value={form.gender}
                  onChange={(event) => setForm({ ...form, gender: event.target.value })}
                />
              </label>
              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </label>
              <label>
                Email
                <input
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                />
              </label>
            </div>
            <label>
              Address
              <textarea
                rows="2"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
              />
            </label>
            <label>
              Medical history
              <textarea
                rows="4"
                value={form.medicalHistory}
                onChange={(event) => setForm({ ...form, medicalHistory: event.target.value })}
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button" disabled={saving}>
                {saving ? 'Saving...' : 'Save patient'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
