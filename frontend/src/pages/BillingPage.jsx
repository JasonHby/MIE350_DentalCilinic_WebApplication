import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { createBill, getBills, getPatients, updateBill } from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState, Modal, StatusBadge } from '../components/Common'
import { emptyBillForm } from '../lib/forms'
import { formatCurrency, formatDate } from '../lib/format'

export default function BillingPage() {
  const { notify } = useAppContext()
  const [searchParams] = useSearchParams()
  const patientId = searchParams.get('patientId')
  const [bills, setBills] = useState([])
  const [patients, setPatients] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [updateBillState, setUpdateBillState] = useState(null)
  const [createForm, setCreateForm] = useState(emptyBillForm(patientId))

  async function loadBillingData() {
    setLoading(true)
    try {
      const [billData, patientData] = await Promise.all([getBills(patientId), getPatients()])
      setBills(billData)
      setPatients(patientData)
      setCreateForm((current) => ({ ...current, patientId: current.patientId || patientId || '' }))
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBillingData()
  }, [patientId])

  const filteredBills = useMemo(() => {
    if (!statusFilter) return bills
    return bills.filter((bill) => bill.paymentStatus === statusFilter)
  }, [bills, statusFilter])

  async function quickMarkPaid(bill) {
    try {
      await updateBill(bill.billId, {
        paymentStatus: 'Paid',
        amountPaid: bill.totalAmount,
        paymentMethod: bill.paymentMethod || 'Cash',
      })
      notify('Bill marked as paid.')
      loadBillingData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function handleCreate(event) {
    event.preventDefault()
    try {
      await createBill({
        patientId: Number(createForm.patientId),
        totalAmount: Number(createForm.totalAmount),
        amountPaid: Number(createForm.amountPaid || 0),
        paymentMethod: createForm.paymentMethod || null,
        paymentStatus: createForm.paymentStatus,
      })
      notify('Bill created.')
      setCreateOpen(false)
      setCreateForm(emptyBillForm(patientId))
      loadBillingData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function handleUpdate(event) {
    event.preventDefault()
    try {
      await updateBill(updateBillState.billId, {
        paymentStatus: updateBillState.paymentStatus,
        amountPaid: Number(updateBillState.amountPaid || 0),
        paymentMethod: updateBillState.paymentMethod || null,
      })
      notify('Payment updated.')
      setUpdateBillState(null)
      loadBillingData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <div className="page-stack">
      <section className="toolbar">
        <div className="toolbar-copy">
          <h2>{patientId ? `Billing for patient #${patientId}` : 'Billing management'}</h2>
          <p>Review invoices, update payments, and generate manual bills.</p>
        </div>
        <div className="toolbar-actions">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Paid">Paid</option>
          </select>
          <button type="button" className="primary-button" onClick={() => setCreateOpen(true)}>
            New bill
          </button>
        </div>
      </section>
      <section className="panel">
        {loading ? (
          <div className="loading-card">Loading bills...</div>
        ) : filteredBills.length === 0 ? (
          <EmptyState title="No bills found" body="Try another filter or create a new bill." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Patient</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Paid</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.billId}>
                    <td>{bill.billId}</td>
                    <td>
                      {bill.patient ? (
                        <Link className="inline-link" to={`/patients/${bill.patientId}`}>
                          {bill.patient.firstName} {bill.patient.lastName}
                        </Link>
                      ) : (
                        `Patient #${bill.patientId}`
                      )}
                    </td>
                    <td>{formatDate(bill.billingDate)}</td>
                    <td>{formatCurrency(bill.totalAmount)}</td>
                    <td>{formatCurrency(bill.amountPaid)}</td>
                    <td>{bill.paymentMethod || '-'}</td>
                    <td><StatusBadge status={bill.paymentStatus} /></td>
                    <td className="row-actions">
                      {bill.paymentStatus !== 'Paid' ? (
                        <>
                          <button type="button" className="ghost-button" onClick={() => quickMarkPaid(bill)}>
                            Mark paid
                          </button>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() =>
                              setUpdateBillState({
                                billId: bill.billId,
                                paymentStatus: bill.paymentStatus,
                                amountPaid: String(bill.amountPaid || 0),
                                paymentMethod: bill.paymentMethod || '',
                              })
                            }
                          >
                            Update
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {createOpen ? (
        <Modal title="Create bill" onClose={() => setCreateOpen(false)}>
          <form className="modal-form" onSubmit={handleCreate}>
            <div className="field-grid">
              <label>
                Patient
                <select
                  value={createForm.patientId}
                  onChange={(event) => setCreateForm({ ...createForm, patientId: event.target.value })}
                >
                  <option value="">Select patient</option>
                  {patients.map((patient) => (
                    <option key={patient.patientId} value={patient.patientId}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Total amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.totalAmount}
                  onChange={(event) => setCreateForm({ ...createForm, totalAmount: event.target.value })}
                />
              </label>
              <label>
                Amount paid
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={createForm.amountPaid}
                  onChange={(event) => setCreateForm({ ...createForm, amountPaid: event.target.value })}
                />
              </label>
              <label>
                Payment method
                <input
                  value={createForm.paymentMethod}
                  onChange={(event) => setCreateForm({ ...createForm, paymentMethod: event.target.value })}
                />
              </label>
              <label>
                Status
                <select
                  value={createForm.paymentStatus}
                  onChange={(event) => setCreateForm({ ...createForm, paymentStatus: event.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setCreateOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Create bill
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {updateBillState ? (
        <Modal title={`Update bill #${updateBillState.billId}`} onClose={() => setUpdateBillState(null)}>
          <form className="modal-form" onSubmit={handleUpdate}>
            <div className="field-grid">
              <label>
                Status
                <select
                  value={updateBillState.paymentStatus}
                  onChange={(event) => setUpdateBillState({ ...updateBillState, paymentStatus: event.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </label>
              <label>
                Amount paid
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={updateBillState.amountPaid}
                  onChange={(event) => setUpdateBillState({ ...updateBillState, amountPaid: event.target.value })}
                />
              </label>
              <label>
                Payment method
                <input
                  value={updateBillState.paymentMethod}
                  onChange={(event) => setUpdateBillState({ ...updateBillState, paymentMethod: event.target.value })}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setUpdateBillState(null)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Save
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  )
}
