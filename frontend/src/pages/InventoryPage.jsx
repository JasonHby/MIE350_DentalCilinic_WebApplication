import { useEffect, useMemo, useState } from 'react'
import {
  consumeInventory,
  createInventoryItem,
  getInventory,
  getInventoryHistory,
  restockInventory,
} from '../api'
import { useAppContext } from '../components/AppContext'
import { EmptyState, Modal, StatusBadge } from '../components/Common'
import { emptyInventoryForm } from '../lib/forms'
import { formatCurrency, formatDate, formatDateTime } from '../lib/format'

export default function InventoryPage() {
  const { notify } = useAppContext()
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [restockState, setRestockState] = useState(null)
  const [consumeState, setConsumeState] = useState(null)
  const [historyState, setHistoryState] = useState(null)
  const [addForm, setAddForm] = useState(emptyInventoryForm())

  async function loadInventoryData() {
    setLoading(true)
    try {
      setItems(await getInventory())
    } catch (err) {
      notify(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventoryData()
  }, [])

  const categories = useMemo(
    () => [...new Set(items.map((item) => item.category).filter(Boolean))].sort(),
    [items],
  )

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = !search || item.itemName.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !category || item.category === category
      const isLow = Number(item.quantity || 0) <= Number(item.reorderLevel || 0)
      const matchesStatus = !status || (status === 'low' ? isLow : !isLow)
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, search, category, status])

  const lowStockItems = items.filter((item) => Number(item.quantity || 0) <= Number(item.reorderLevel || 0))

  async function handleAdd(event) {
    event.preventDefault()
    try {
      await createInventoryItem({
        itemName: addForm.itemName,
        category: addForm.category || null,
        supplier: addForm.supplier || null,
        quantity: Number(addForm.quantity || 0),
        unitPrice: Number(addForm.unitPrice || 0),
        reorderLevel: Number(addForm.reorderLevel || 0),
      })
      notify('Inventory item created.')
      setAddOpen(false)
      setAddForm(emptyInventoryForm())
      loadInventoryData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function submitRestock(event) {
    event.preventDefault()
    try {
      await restockInventory(restockState.itemId, {
        quantity: Number(restockState.quantity),
        supplier: restockState.supplier || null,
      })
      notify('Item restocked.')
      setRestockState(null)
      loadInventoryData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function submitConsume(event) {
    event.preventDefault()
    try {
      await consumeInventory(consumeState.itemId, {
        quantity: Number(consumeState.quantity),
        reason: consumeState.reason || null,
      })
      notify('Inventory updated.')
      setConsumeState(null)
      loadInventoryData()
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  async function openHistory(item) {
    try {
      const logs = await getInventoryHistory({ itemId: item.itemId })
      setHistoryState({ itemName: item.itemName, logs })
    } catch (err) {
      notify(err.message, 'error')
    }
  }

  return (
    <div className="page-stack">
      {lowStockItems.length ? (
        <section className="alert-banner">
          {lowStockItems.length} item(s) are below reorder level and need attention.
        </section>
      ) : null}
      <section className="toolbar">
        <div className="toolbar-copy">
          <h2>Inventory ledger</h2>
          <p>Track supplies, replenishment, usage, and audit history.</p>
        </div>
        <div className="toolbar-actions toolbar-wrap">
          <input
            className="search-input"
            placeholder="Search inventory"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All stock states</option>
            <option value="low">Low stock</option>
            <option value="ok">Healthy stock</option>
          </select>
          <button type="button" className="primary-button" onClick={() => setAddOpen(true)}>
            Add item
          </button>
        </div>
      </section>
      <section className="panel">
        {loading ? (
          <div className="loading-card">Loading inventory...</div>
        ) : filteredItems.length === 0 ? (
          <EmptyState title="No items found" body="Try a different filter or add a new item." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit price</th>
                  <th>Reorder level</th>
                  <th>Supplier</th>
                  <th>Last restocked</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isLow = Number(item.quantity || 0) <= Number(item.reorderLevel || 0)
                  return (
                    <tr key={item.itemId} className={isLow ? 'row-low-stock' : ''}>
                      <td>{item.itemName}</td>
                      <td>{item.category || '-'}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{item.reorderLevel}</td>
                      <td>{item.supplier || '-'}</td>
                      <td>{formatDate(item.lastRestocked)}</td>
                      <td><StatusBadge status={isLow ? 'Low Stock' : 'OK'} /></td>
                      <td className="row-actions">
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() =>
                            setRestockState({
                              itemId: item.itemId,
                              itemName: item.itemName,
                              quantity: '1',
                              supplier: item.supplier || '',
                            })
                          }
                        >
                          Restock
                        </button>
                        <button
                          type="button"
                          className="ghost-button"
                          onClick={() =>
                            setConsumeState({
                              itemId: item.itemId,
                              itemName: item.itemName,
                              quantity: '1',
                              reason: '',
                            })
                          }
                        >
                          Consume
                        </button>
                        <button type="button" className="ghost-button" onClick={() => openHistory(item)}>
                          History
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {addOpen ? (
        <Modal title="Add inventory item" onClose={() => setAddOpen(false)}>
          <form className="modal-form" onSubmit={handleAdd}>
            <div className="field-grid">
              <label>
                Item name
                <input
                  value={addForm.itemName}
                  onChange={(event) => setAddForm({ ...addForm, itemName: event.target.value })}
                />
              </label>
              <label>
                Category
                <input
                  value={addForm.category}
                  onChange={(event) => setAddForm({ ...addForm, category: event.target.value })}
                />
              </label>
              <label>
                Supplier
                <input
                  value={addForm.supplier}
                  onChange={(event) => setAddForm({ ...addForm, supplier: event.target.value })}
                />
              </label>
              <label>
                Quantity
                <input
                  type="number"
                  min="0"
                  value={addForm.quantity}
                  onChange={(event) => setAddForm({ ...addForm, quantity: event.target.value })}
                />
              </label>
              <label>
                Unit price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={addForm.unitPrice}
                  onChange={(event) => setAddForm({ ...addForm, unitPrice: event.target.value })}
                />
              </label>
              <label>
                Reorder level
                <input
                  type="number"
                  min="0"
                  value={addForm.reorderLevel}
                  onChange={(event) => setAddForm({ ...addForm, reorderLevel: event.target.value })}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setAddOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Add item
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {restockState ? (
        <Modal title={`Restock ${restockState.itemName}`} onClose={() => setRestockState(null)}>
          <form className="modal-form" onSubmit={submitRestock}>
            <div className="field-grid">
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  value={restockState.quantity}
                  onChange={(event) => setRestockState({ ...restockState, quantity: event.target.value })}
                />
              </label>
              <label>
                Supplier
                <input
                  value={restockState.supplier}
                  onChange={(event) => setRestockState({ ...restockState, supplier: event.target.value })}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setRestockState(null)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Confirm restock
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {consumeState ? (
        <Modal title={`Consume ${consumeState.itemName}`} onClose={() => setConsumeState(null)}>
          <form className="modal-form" onSubmit={submitConsume}>
            <div className="field-grid">
              <label>
                Quantity
                <input
                  type="number"
                  min="1"
                  value={consumeState.quantity}
                  onChange={(event) => setConsumeState({ ...consumeState, quantity: event.target.value })}
                />
              </label>
              <label className="field-span">
                Reason
                <input
                  value={consumeState.reason}
                  onChange={(event) => setConsumeState({ ...consumeState, reason: event.target.value })}
                />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="ghost-button" onClick={() => setConsumeState(null)}>
                Cancel
              </button>
              <button type="submit" className="primary-button">
                Confirm usage
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {historyState ? (
        <Modal title={`History: ${historyState.itemName}`} onClose={() => setHistoryState(null)} wide>
          {historyState.logs.length === 0 ? (
            <p className="muted-copy">No history records found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Quantity changed</th>
                    <th>Previous</th>
                    <th>New</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {historyState.logs.map((log) => (
                    <tr key={log.logId}>
                      <td>{formatDateTime(log.changedAt)}</td>
                      <td><StatusBadge status={log.changeType} /></td>
                      <td>{log.quantityChanged}</td>
                      <td>{log.previousQty}</td>
                      <td>{log.newQty}</td>
                      <td>{log.reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      ) : null}
    </div>
  )
}
