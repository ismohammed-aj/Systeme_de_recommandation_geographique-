import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  create as createArret,
  getAll as getAllArrets,
  remove as removeArret,
  update as updateArret,
} from '../../api/arretApi'
import { useInputFeedback } from '../../hooks/useInputFeedback'

const emptyForm = {
  nomArret: '',
  latitude: '',
  longitude: '',
  adresse: '',
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

const getArretsFromResponse = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

function GestionArrets() {
  const [arrets, setArrets] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingArretId, setEditingArretId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingArretId, setDeletingArretId] = useState(null)
  const [error, setError] = useState('')
  const {
    inputFeedback,
    resetInputFeedback,
    updateInputFeedback,
  } = useInputFeedback(emptyForm)

  const loadArrets = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getAllArrets()
      setArrets(getArretsFromResponse(response.data))
    } catch (requestError) {
      setError(getErrorMessage(
        requestError,
        'Unable to load stops. Please try again later.',
      ))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadArrets, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadArrets])

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
    setEditingArretId(null)
  }

  const parseCoordinate = (value) => Number(String(value).replace(',', '.'))

  const buildPayload = () => ({
    nomArret: formData.nomArret.trim(),
    latitude: parseCoordinate(formData.latitude),
    longitude: parseCoordinate(formData.longitude),
    adresse: formData.adresse.trim() || null,
  })

  const validatePayload = (payload) => {
    if (!payload.nomArret) {
      return "Le nom de l'arret est obligatoire."
    }

    if (!Number.isFinite(payload.latitude)) {
      return 'La latitude doit etre un nombre valide.'
    }

    if (payload.latitude < -90 || payload.latitude > 90) {
      return 'La latitude doit etre entre -90 et 90.'
    }

    if (!Number.isFinite(payload.longitude)) {
      return 'La longitude doit etre un nombre valide.'
    }

    if (payload.longitude < -180 || payload.longitude > 180) {
      return 'La longitude doit etre entre -180 et 180.'
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

      if (editingArretId) {
        await updateArret(editingArretId, {
          idArret: editingArretId,
          ...payload,
        })
      } else {
        await createArret(payload)
      }

      resetForm()
      await loadArrets()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to save the stop. Please try again later.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (arret) => {
    const nextFormData = {
      nomArret: arret.nomArret ?? '',
      latitude: arret.latitude ?? '',
      longitude: arret.longitude ?? '',
      adresse: arret.adresse ?? '',
    }

    setEditingArretId(arret.idArret)
    setFormData(nextFormData)
    resetInputFeedback(nextFormData)
    setError('')
  }

  const handleDelete = async (arret) => {
    const shouldDelete = window.confirm(
      `Delete ${arret.nomArret ?? 'this stop'}?`,
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingArretId(arret.idArret)
      setError('')
      await removeArret(arret.idArret)

      if (editingArretId === arret.idArret) {
        resetForm()
      }

      await loadArrets()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to delete the stop. Please try again later.',
        ),
      )
    } finally {
      setDeletingArretId(null)
    }
  }

  return (
    <section className="page admin-crud-page">
      <div className="page-header">
        <div>
          <h1>Gestion Arrets</h1>
          <p>Create, edit, and delete transport stops.</p>
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
          <h2>{editingArretId ? 'Edit Arret' : 'New Arret'}</h2>

          <label>
            Stop name
            <input
              className={inputFeedback.nomArret || ''}
              name="nomArret"
              onChange={handleChange}
              required
              type="text"
              value={formData.nomArret}
            />
          </label>

          <label>
            Latitude
            <input
              className={inputFeedback.latitude || ''}
              inputMode="decimal"
              name="latitude"
              onChange={handleChange}
              required
              type="text"
              value={formData.latitude}
            />
          </label>

          <label>
            Longitude
            <input
              className={inputFeedback.longitude || ''}
              inputMode="decimal"
              name="longitude"
              onChange={handleChange}
              required
              type="text"
              value={formData.longitude}
            />
          </label>

          <label>
            Address
            <input
              className={inputFeedback.adresse || ''}
              name="adresse"
              onChange={handleChange}
              type="text"
              value={formData.adresse}
            />
          </label>

          <div className="form-actions">
            <button className="button button--primary" disabled={isSubmitting} type="submit">
              {isSubmitting
                ? 'Saving...'
                : editingArretId
                  ? 'Update Arret'
                  : 'Create Arret'}
            </button>
            {editingArretId && (
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
            <h2>Arrets</h2>
            <button
              className="button button--secondary"
              disabled={isLoading}
              onClick={loadArrets}
              type="button"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="status-card" role="status">
              Loading stops...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {arrets.length === 0 ? (
                    <tr>
                      <td colSpan="6">No stops found.</td>
                    </tr>
                  ) : (
                    arrets.map((arret) => (
                      <tr key={arret.idArret}>
                        <td>{arret.idArret}</td>
                        <td>{arret.nomArret}</td>
                        <td>{arret.latitude}</td>
                        <td>{arret.longitude}</td>
                        <td>{arret.adresse}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="button button--secondary"
                              onClick={() => handleEdit(arret)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="button button--danger"
                              disabled={deletingArretId === arret.idArret}
                              onClick={() => handleDelete(arret)}
                              type="button"
                            >
                              {deletingArretId === arret.idArret
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

export default GestionArrets
