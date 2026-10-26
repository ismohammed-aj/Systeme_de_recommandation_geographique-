import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  create as createBus,
  getAll as getAllBus,
  remove as removeBus,
  update as updateBus,
} from '../../api/busApi'
import { useInputFeedback } from '../../hooks/useInputFeedback'

const emptyForm = {
  matricule: '',
  capacite: '',
  statut: '',
}

const getErrorMessage = (requestError, fallbackMessage) => {
  const responseData = requestError.response?.data

  if (responseData?.errors) {
    return Object.values(responseData.errors).join(' ')
  }

  if (responseData?.message) {
    return responseData.message
  }

  if (requestError.request) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion internet ou réessayez plus tard.'
  }

  return fallbackMessage
}

const getBusFromResponse = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

function GestionBus() {
  const [busList, setBusList] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingBusId, setEditingBusId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingBusId, setDeletingBusId] = useState(null)
  const [error, setError] = useState('')
  const {
    inputFeedback,
    resetInputFeedback,
    updateInputFeedback,
  } = useInputFeedback(emptyForm)

  const loadBus = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getAllBus()
      setBusList(getBusFromResponse(response.data))
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to load bus. Please try again later.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadBus, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadBus])

  const handleChange = (event) => {
    const { name, value } = event.target

    updateInputFeedback(name, value)
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    resetInputFeedback()
    setEditingBusId(null)
  }

  const buildPayload = () => ({
    matricule: formData.matricule.trim(),
    capacite: formData.capacite === '' ? null : Number(formData.capacite),
    statut: formData.statut.trim() || null,
  })

  const validatePayload = (payload) => {
    if (!payload.matricule) {
      return 'Le matricule est obligatoire.'
    }

    if (payload.capacite !== null) {
      if (!Number.isInteger(payload.capacite)) {
        return 'La capacite doit etre un nombre entier.'
      }

      if (payload.capacite < 0) {
        return 'La capacite doit etre superieure ou egale a 0.'
      }
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = buildPayload()
    const validationError = validatePayload(payload)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setIsSubmitting(true)
      setError('')

      if (editingBusId) {
        await updateBus(editingBusId, {
          idBus: editingBusId,
          ...payload,
        })
      } else {
        await createBus(payload)
      }

      resetForm()
      await loadBus()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to save the bus. Please try again later.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (bus) => {
    const nextFormData = {
      matricule: bus.matricule ?? '',
      capacite: bus.capacite ?? '',
      statut: bus.statut ?? '',
    }

    setEditingBusId(bus.idBus)
    setFormData(nextFormData)
    resetInputFeedback(nextFormData)
    setError('')
  }

  const handleDelete = async (bus) => {
    const shouldDelete = window.confirm(
      `Delete ${bus.matricule ?? 'this bus'}?`,
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingBusId(bus.idBus)
      setError('')
      await removeBus(bus.idBus)

      if (editingBusId === bus.idBus) {
        resetForm()
      }

      await loadBus()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to delete the bus. Please try again later.',
        ),
      )
    } finally {
      setDeletingBusId(null)
    }
  }

  return (
    <section className="page admin-crud-page">
      <div className="page-header">
        <div>
          <h1>Gestion Bus</h1>
          <p>Create, edit, and delete bus records.</p>
        </div>
        <Link className="text-link" to="/admin">
          Back to Admin Dashboard
        </Link>
      </div>

      {error && (
        <div className="status-card status-card--error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-crud-grid">
        <form className="crud-form" onSubmit={handleSubmit}>
          <h2>{editingBusId ? 'Edit Bus' : 'New Bus'}</h2>

          <label>
            Matricule
            <input
              className={inputFeedback.matricule || ''}
              name="matricule"
              onChange={handleChange}
              required
              type="text"
              value={formData.matricule}
            />
          </label>

          <label>
            Capacite
            <input
              className={inputFeedback.capacite || ''}
              min="0"
              name="capacite"
              onChange={handleChange}
              step="1"
              type="number"
              value={formData.capacite}
            />
          </label>

          <label>
            Statut
            <input
              className={inputFeedback.statut || ''}
              name="statut"
              onChange={handleChange}
              type="text"
              value={formData.statut}
            />
          </label>

          <div className="form-actions">
            <button
              className="button button--primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? 'Saving...'
                : editingBusId
                  ? 'Update Bus'
                  : 'Create Bus'}
            </button>
            {editingBusId && (
              <button
                className="button button--secondary"
                disabled={isSubmitting}
                onClick={resetForm}
                type="button"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="table-panel">
          <div className="table-panel__header">
            <h2>Bus</h2>
            <button
              className="button button--secondary"
              disabled={isLoading}
              onClick={loadBus}
              type="button"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="status-card" role="status">
              Loading bus...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Matricule</th>
                    <th>Capacite</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {busList.length === 0 ? (
                    <tr>
                      <td colSpan="5">No bus found.</td>
                    </tr>
                  ) : (
                    busList.map((bus) => (
                      <tr key={bus.idBus}>
                        <td>{bus.idBus}</td>
                        <td>{bus.matricule}</td>
                        <td>{bus.capacite ?? '-'}</td>
                        <td>{bus.statut ?? '-'}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="button button--secondary"
                              onClick={() => handleEdit(bus)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="button button--danger"
                              disabled={deletingBusId === bus.idBus}
                              onClick={() => handleDelete(bus)}
                              type="button"
                            >
                              {deletingBusId === bus.idBus
                                ? 'Deleting...'
                                : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default GestionBus
