import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  create as createChauffeur,
  getAll as getAllChauffeurs,
  remove as removeChauffeur,
  update as updateChauffeur,
} from '../../api/chauffeurApi'
import { useInputFeedback } from '../../hooks/useInputFeedback'

const emptyForm = {
  nom: '',
  prenom: '',
  telephone: '',
  numeroPermis: '',
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

const getChauffeursFromResponse = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

function GestionChauffeurs() {
  const [chauffeurs, setChauffeurs] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingChauffeurId, setEditingChauffeurId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingChauffeurId, setDeletingChauffeurId] = useState(null)
  const [error, setError] = useState('')
  const {
    inputFeedback,
    resetInputFeedback,
    updateInputFeedback,
  } = useInputFeedback(emptyForm)

  const loadChauffeurs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getAllChauffeurs()
      setChauffeurs(getChauffeursFromResponse(response.data))
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to load drivers. Please try again later.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadChauffeurs, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadChauffeurs])

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
    setEditingChauffeurId(null)
  }

  const buildPayload = () => ({
    nom: formData.nom.trim(),
    prenom: formData.prenom.trim(),
    telephone: formData.telephone.trim() || null,
    numeroPermis: formData.numeroPermis.trim() || null,
  })

  const validatePayload = (payload) => {
    if (!payload.nom) {
      return 'Le nom est obligatoire.'
    }

    if (!payload.prenom) {
      return 'Le prenom est obligatoire.'
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

      if (editingChauffeurId !== null) {
        await updateChauffeur(editingChauffeurId, {
          idChauffeur: editingChauffeurId,
          ...payload,
        })
      } else {
        await createChauffeur(payload)
      }

      resetForm()
      await loadChauffeurs()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to save the driver. Please try again later.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (chauffeur) => {
    const nextFormData = {
      nom: chauffeur.nom ?? '',
      prenom: chauffeur.prenom ?? '',
      telephone: chauffeur.telephone ?? '',
      numeroPermis: chauffeur.numeroPermis ?? '',
    }

    setEditingChauffeurId(chauffeur.idChauffeur)
    setFormData(nextFormData)
    resetInputFeedback(nextFormData)
    setError('')
  }

  const handleDelete = async (chauffeur) => {
    const fullName = `${chauffeur.prenom ?? ''} ${chauffeur.nom ?? ''}`.trim()
    const shouldDelete = window.confirm(
      `Delete ${fullName || 'this driver'}?`,
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingChauffeurId(chauffeur.idChauffeur)
      setError('')
      await removeChauffeur(chauffeur.idChauffeur)

      if (editingChauffeurId === chauffeur.idChauffeur) {
        resetForm()
      }

      await loadChauffeurs()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to delete the driver. Please try again later.',
        ),
      )
    } finally {
      setDeletingChauffeurId(null)
    }
  }

  return (
    <section className="page admin-crud-page">
      <div className="page-header">
        <div>
          <h1>Gestion Chauffeurs</h1>
          <p>Create, edit, and delete driver records.</p>
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
          <h2>{editingChauffeurId !== null ? 'Edit Chauffeur' : 'New Chauffeur'}</h2>

          <label>
            Nom
            <input
              className={inputFeedback.nom || ''}
              name="nom"
              onChange={handleChange}
              required
              type="text"
              value={formData.nom}
            />
          </label>

          <label>
            Prenom
            <input
              className={inputFeedback.prenom || ''}
              name="prenom"
              onChange={handleChange}
              required
              type="text"
              value={formData.prenom}
            />
          </label>

          <label>
            Telephone
            <input
              className={inputFeedback.telephone || ''}
              name="telephone"
              onChange={handleChange}
              type="tel"
              value={formData.telephone}
            />
          </label>

          <label>
            Numero permis
            <input
              className={inputFeedback.numeroPermis || ''}
              name="numeroPermis"
              onChange={handleChange}
              type="text"
              value={formData.numeroPermis}
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
                : editingChauffeurId !== null
                  ? 'Update Chauffeur'
                  : 'Create Chauffeur'}
            </button>
            {editingChauffeurId !== null && (
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
            <h2>Chauffeurs</h2>
            <button
              className="button button--secondary"
              disabled={isLoading}
              onClick={loadChauffeurs}
              type="button"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="status-card" role="status">
              Loading drivers...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Telephone</th>
                    <th>Numero permis</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {chauffeurs.length === 0 ? (
                    <tr>
                      <td colSpan="6">No drivers found.</td>
                    </tr>
                  ) : (
                    chauffeurs.map((chauffeur) => (
                      <tr key={chauffeur.idChauffeur}>
                        <td>{chauffeur.idChauffeur}</td>
                        <td>{chauffeur.nom}</td>
                        <td>{chauffeur.prenom}</td>
                        <td>{chauffeur.telephone ?? '-'}</td>
                        <td>{chauffeur.numeroPermis ?? '-'}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="button button--secondary"
                              onClick={() => handleEdit(chauffeur)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="button button--danger"
                              disabled={
                                deletingChauffeurId === chauffeur.idChauffeur
                              }
                              onClick={() => handleDelete(chauffeur)}
                              type="button"
                            >
                              {deletingChauffeurId === chauffeur.idChauffeur
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

export default GestionChauffeurs
