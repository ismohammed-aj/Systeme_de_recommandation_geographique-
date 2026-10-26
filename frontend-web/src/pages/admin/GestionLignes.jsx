import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { createArret, getAll as getAllArrets } from '../../api/arretApi'
import { getAll as getAllBus } from '../../api/busApi'
import { getAll as getAllChauffeurs } from '../../api/chauffeurApi'
import {
  createLigneArret,
  getByLigneId as getLigneArretsByLigneId,
  remove as removeLigneArret,
} from '../../api/ligneArretApi'
import {
  create as createLigne,
  getAll as getAllLignes,
  remove as removeLigne,
  update as updateLigne,
} from '../../api/ligneApi'
import MapView from '../../components/map/MapView'
import { useInputFeedback } from '../../hooks/useInputFeedback'

const emptyForm = {
  nomLigne: '',
  description: '',
  idBus: '',
  idChauffeur: '',
}

const emptyLigneArretForm = {
  idArret: '',
  ordre: '',
}

const emptyMapStopForm = {
  nomArret: '',
  adresse: '',
}

const safiMapCenter = [32.2994, -9.2372]

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

const getItemsFromResponse = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

function GestionLignes() {
  const [lignes, setLignes] = useState([])
  const [busList, setBusList] = useState([])
  const [chauffeurs, setChauffeurs] = useState([])
  const [arrets, setArrets] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [ligneArretForm, setLigneArretForm] = useState(emptyLigneArretForm)
  const [selectedLigneId, setSelectedLigneId] = useState('')
  const [selectedLigneArrets, setSelectedLigneArrets] = useState([])
  const [editingLigneId, setEditingLigneId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLigneArretsLoading, setIsLigneArretsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLigneArretSubmitting, setIsLigneArretSubmitting] = useState(false)
  const [isMapStopSubmitting, setIsMapStopSubmitting] = useState(false)
  const [deletingLigneId, setDeletingLigneId] = useState(null)
  const [deletingLigneArretId, setDeletingLigneArretId] = useState(null)
  const [pendingMapStop, setPendingMapStop] = useState(null)
  const [pendingMapStopName, setPendingMapStopName] = useState('')
  const [pendingMapStopAddress, setPendingMapStopAddress] = useState('')
  const [error, setError] = useState('')
  const [ligneArretError, setLigneArretError] = useState('')
  const [mapBuilderError, setMapBuilderError] = useState('')
  const [mapBuilderStatus, setMapBuilderStatus] = useState('')
  const {
    inputFeedback,
    resetInputFeedback,
    updateInputFeedback,
  } = useInputFeedback(emptyForm)
  const {
    inputFeedback: ligneArretInputFeedback,
    resetInputFeedback: resetLigneArretInputFeedback,
    updateInputFeedback: updateLigneArretInputFeedback,
  } = useInputFeedback(emptyLigneArretForm)
  const {
    inputFeedback: mapStopInputFeedback,
    resetInputFeedback: resetMapStopInputFeedback,
    updateInputFeedback: updateMapStopInputFeedback,
  } = useInputFeedback(emptyMapStopForm)

  const busById = useMemo(
    () => new Map(busList.map((bus) => [bus.idBus, bus])),
    [busList],
  )

  const chauffeurById = useMemo(
    () =>
      new Map(
        chauffeurs.map((chauffeur) => [
          chauffeur.idChauffeur,
          chauffeur,
        ]),
      ),
    [chauffeurs],
  )

  const arretById = useMemo(
    () => new Map(arrets.map((arret) => [arret.idArret, arret])),
    [arrets],
  )

  const selectedRouteStops = useMemo(
    () =>
      selectedLigneArrets
        .map((ligneArret) => {
          const arret = arretById.get(ligneArret.idArret)

          if (!arret) {
            return null
          }

          return {
            ...arret,
            idLigneArret: ligneArret.idLigneArret,
            ordre: ligneArret.ordre,
          }
        })
        .filter(Boolean)
        .sort((firstStop, secondStop) => firstStop.ordre - secondStop.ordre),
    [arretById, selectedLigneArrets],
  )

  const loadPageData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const [
        lignesResponse,
        busResponse,
        chauffeursResponse,
        arretsResponse,
      ] = await Promise.all([
        getAllLignes(),
        getAllBus(),
        getAllChauffeurs(),
        getAllArrets(),
      ])

      setLignes(getItemsFromResponse(lignesResponse.data))
      setBusList(getItemsFromResponse(busResponse.data))
      setChauffeurs(getItemsFromResponse(chauffeursResponse.data))
      setArrets(getItemsFromResponse(arretsResponse.data))
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to load lines. Please try again later.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadArrets = useCallback(async () => {
    const response = await getAllArrets()
    setArrets(getItemsFromResponse(response.data))
  }, [])

  const loadSelectedLigneArrets = useCallback(async (idLigne) => {
    if (!idLigne) {
      setSelectedLigneArrets([])
      return
    }

    try {
      setIsLigneArretsLoading(true)
      setLigneArretError('')

      const response = await getLigneArretsByLigneId(idLigne)
      const orderedLigneArrets = [...getItemsFromResponse(response.data)].sort(
        (firstItem, secondItem) => firstItem.ordre - secondItem.ordre,
      )

      setSelectedLigneArrets(orderedLigneArrets)
    } catch (requestError) {
      setLigneArretError(
        getErrorMessage(
          requestError,
          'Unable to load line stops. Please try again later.',
        ),
      )
    } finally {
      setIsLigneArretsLoading(false)
    }
  }, [])

  const loadLignes = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getAllLignes()
      setLignes(getItemsFromResponse(response.data))
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to refresh lines. Please try again later.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadPageData, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadPageData])

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => loadSelectedLigneArrets(selectedLigneId),
      0,
    )

    return () => window.clearTimeout(timeoutId)
  }, [loadSelectedLigneArrets, selectedLigneId])

  const handleChange = (event) => {
    const { name, value } = event.target

    updateInputFeedback(name, value)
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleLigneArretChange = (event) => {
    const { name, value } = event.target

    updateLigneArretInputFeedback(name, value)
    setLigneArretForm((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleSelectedLigneChange = (event) => {
    setSelectedLigneId(event.target.value)
    setLigneArretForm(emptyLigneArretForm)
    setLigneArretError('')
    setMapBuilderError('')
    setMapBuilderStatus('')
    setPendingMapStop(null)
    setPendingMapStopName('')
    setPendingMapStopAddress('')
    resetLigneArretInputFeedback()
    resetMapStopInputFeedback()
  }

  const resetForm = () => {
    setFormData(emptyForm)
    resetInputFeedback()
    setEditingLigneId(null)
  }

  const resetLigneArretForm = () => {
    setLigneArretForm(emptyLigneArretForm)
    resetLigneArretInputFeedback()
  }

  const buildPayload = () => ({
    nomLigne: formData.nomLigne.trim(),
    description: formData.description.trim() || null,
    idBus: formData.idBus === '' ? null : Number(formData.idBus),
    idChauffeur:
      formData.idChauffeur === '' ? null : Number(formData.idChauffeur),
  })

  const validatePayload = (payload) => {
    if (!payload.nomLigne) {
      return 'Le nom de la ligne est obligatoire.'
    }

    if (payload.idBus !== null && !Number.isInteger(payload.idBus)) {
      return 'Le bus selectionne est invalide.'
    }

    if (
      payload.idChauffeur !== null &&
      !Number.isInteger(payload.idChauffeur)
    ) {
      return 'Le chauffeur selectionne est invalide.'
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

      if (editingLigneId !== null) {
        await updateLigne(editingLigneId, {
          idLigne: editingLigneId,
          ...payload,
        })
      } else {
        await createLigne(payload)
      }

      resetForm()
      await loadLignes()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to save the line. Please try again later.',
        ),
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (ligne) => {
    const nextFormData = {
      nomLigne: ligne.nomLigne ?? '',
      description: ligne.description ?? '',
      idBus: ligne.idBus == null ? '' : String(ligne.idBus),
      idChauffeur: ligne.idChauffeur == null ? '' : String(ligne.idChauffeur),
    }

    setEditingLigneId(ligne.idLigne)
    setFormData(nextFormData)
    resetInputFeedback(nextFormData)
    setError('')
  }

  const handleDelete = async (ligne) => {
    const shouldDelete = window.confirm(
      `Delete ${ligne.nomLigne ?? 'this line'}?`,
    )

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingLigneId(ligne.idLigne)
      setError('')
      await removeLigne(ligne.idLigne)

      if (editingLigneId === ligne.idLigne) {
        resetForm()
      }

      if (String(ligne.idLigne) === selectedLigneId) {
        setSelectedLigneId('')
        setSelectedLigneArrets([])
        resetLigneArretForm()
        setPendingMapStop(null)
        setPendingMapStopName('')
        setPendingMapStopAddress('')
        resetMapStopInputFeedback()
        setMapBuilderError('')
        setMapBuilderStatus('')
      }

      await loadLignes()
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          'Unable to delete the line. Please try again later.',
        ),
      )
    } finally {
      setDeletingLigneId(null)
    }
  }

  const buildLigneArretPayload = () => ({
    idLigne: selectedLigneId === '' ? null : Number(selectedLigneId),
    idArret: ligneArretForm.idArret === '' ? null : Number(ligneArretForm.idArret),
    ordre: ligneArretForm.ordre === '' ? null : Number(ligneArretForm.ordre),
  })

  const validateLigneArretPayload = (payload) => {
    if (!Number.isInteger(payload.idLigne)) {
      return 'Selectionnez une ligne.'
    }

    if (!Number.isInteger(payload.idArret)) {
      return 'Selectionnez un arret.'
    }

    if (!Number.isInteger(payload.ordre) || payload.ordre <= 0) {
      return "L'ordre doit etre un nombre entier positif."
    }

    return ''
  }

  const handleLigneArretSubmit = async (event) => {
    event.preventDefault()

    const payload = buildLigneArretPayload()
    const validationError = validateLigneArretPayload(payload)
    if (validationError) {
      setLigneArretError(validationError)
      return
    }

    try {
      setIsLigneArretSubmitting(true)
      setLigneArretError('')

      await createLigneArret(payload)
      resetLigneArretForm()
      await loadSelectedLigneArrets(selectedLigneId)
    } catch (requestError) {
      setLigneArretError(
        getErrorMessage(
          requestError,
          'Unable to attach the stop. Please try again later.',
        ),
      )
    } finally {
      setIsLigneArretSubmitting(false)
    }
  }

  const handleLigneArretDelete = async (ligneArret) => {
    const shouldDelete = window.confirm('Remove this stop from the line?')

    if (!shouldDelete) {
      return
    }

    try {
      setDeletingLigneArretId(ligneArret.idLigneArret)
      setLigneArretError('')
      setMapBuilderError('')
      await removeLigneArret(ligneArret.idLigneArret)
      await loadSelectedLigneArrets(selectedLigneId)
      setMapBuilderStatus('Arret supprime du trajet.')
    } catch (requestError) {
      const message = getErrorMessage(
        requestError,
        'Unable to remove the stop from this line. Please try again later.',
      )
      setLigneArretError(message)
      setMapBuilderError(message)
    } finally {
      setDeletingLigneArretId(null)
    }
  }

  const getNextStopOrder = () =>
    selectedLigneArrets.reduce(
      (highestOrder, ligneArret) => Math.max(highestOrder, ligneArret.ordre),
      0,
    ) + 1

  const handleMapClick = ({ latitude, longitude }) => {
    if (!selectedLigneId) {
      setMapBuilderError('Selectionnez une ligne avant de creer un trajet.')
      return
    }

    const nextOrder = getNextStopOrder()
    const defaultStopName = `Arret ${nextOrder}`

    setPendingMapStop({
      id: `pending-${Date.now()}`,
      latitude,
      longitude,
      nomArret: defaultStopName,
      ordre: nextOrder,
    })
    setPendingMapStopName(defaultStopName)
    setPendingMapStopAddress('')
    resetMapStopInputFeedback({
      nomArret: defaultStopName,
      adresse: '',
    })
    setMapBuilderError('')
    setMapBuilderStatus('Renseignez le nom de l arret, puis enregistrez-le.')
  }

  const handleCancelPendingMapStop = () => {
    setPendingMapStop(null)
    setPendingMapStopName('')
    setPendingMapStopAddress('')
    resetMapStopInputFeedback()
    setMapBuilderStatus('')
    setMapBuilderError('')
  }

  const handlePendingMapStopNameChange = (event) => {
    const nextValue = event.target.value

    updateMapStopInputFeedback('nomArret', nextValue)
    setPendingMapStopName(nextValue)
  }

  const handlePendingMapStopAddressChange = (event) => {
    const nextValue = event.target.value

    updateMapStopInputFeedback('adresse', nextValue)
    setPendingMapStopAddress(nextValue)
  }

  const handlePendingMapStopSubmit = async (event) => {
    event.preventDefault()

    if (!selectedLigneId) {
      setMapBuilderError('Selectionnez une ligne avant de sauvegarder un arret.')
      return
    }

    if (!pendingMapStop) {
      setMapBuilderError('Cliquez sur la carte pour choisir la position de l arret.')
      return
    }

    const stopName = pendingMapStopName.trim()
    if (!stopName) {
      setMapBuilderError('Le nom de l arret est obligatoire.')
      return
    }

    try {
      setIsMapStopSubmitting(true)
      setMapBuilderError('')
      setMapBuilderStatus('Creation de l arret et association a la ligne...')

      const arretResponse = await createArret({
        nomArret: stopName,
        latitude: pendingMapStop.latitude,
        longitude: pendingMapStop.longitude,
        adresse: pendingMapStopAddress.trim() || null,
      })
      const savedArret = arretResponse.data

      await createLigneArret({
        idLigne: Number(selectedLigneId),
        idArret: savedArret.idArret,
        ordre: getNextStopOrder(),
      })

      setArrets((currentArrets) => [
        ...currentArrets.filter((arret) => arret.idArret !== savedArret.idArret),
        savedArret,
      ])
      handleCancelPendingMapStop()
      setMapBuilderStatus('Arret ajoute au trajet.')
      await loadSelectedLigneArrets(selectedLigneId)
    } catch (requestError) {
      setMapBuilderError(
        getErrorMessage(
          requestError,
          'Impossible de creer cet arret sur la carte. Reessayez plus tard.',
        ),
      )
    } finally {
      setIsMapStopSubmitting(false)
    }
  }

  const handleRefreshTrajet = async () => {
    if (!selectedLigneId) {
      setMapBuilderError('Selectionnez une ligne avant d actualiser le trajet.')
      return
    }

    try {
      setMapBuilderError('')
      setMapBuilderStatus('Actualisation du trajet...')
      await Promise.all([
        loadArrets(),
        loadSelectedLigneArrets(selectedLigneId),
      ])
      setMapBuilderStatus('Trajet actualise.')
    } catch (requestError) {
      setMapBuilderError(
        getErrorMessage(
          requestError,
          'Impossible d actualiser le trajet. Reessayez plus tard.',
        ),
      )
    }
  }

  const getBusLabel = (idBus) => {
    const bus = busById.get(idBus)
    return bus ? `${bus.matricule} (#${bus.idBus})` : '-'
  }

  const getChauffeurLabel = (idChauffeur) => {
    const chauffeur = chauffeurById.get(idChauffeur)
    if (!chauffeur) {
      return '-'
    }

    return `${chauffeur.prenom ?? ''} ${chauffeur.nom ?? ''}`.trim()
  }

  const getLigneLabel = (idLigne) => {
    const ligne = lignes.find((currentLigne) => currentLigne.idLigne === idLigne)
    return ligne?.nomLigne ?? '-'
  }

  const getArretLabel = (idArret) => {
    const arret = arretById.get(idArret)
    return arret ? `${arret.nomArret} (#${arret.idArret})` : '-'
  }

  const temporaryMapStops = pendingMapStop
    ? [
        {
          ...pendingMapStop,
          nomArret: pendingMapStopName.trim() || pendingMapStop.nomArret,
        },
      ]
    : []

  return (
    <section className="page admin-crud-page">
      <div className="page-header">
        <div>
          <h1>Gestion Lignes</h1>
          <p>Create, edit, and delete transport lines.</p>
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
          <h2>{editingLigneId !== null ? 'Edit Ligne' : 'New Ligne'}</h2>

          <label>
            Nom ligne
            <input
              className={inputFeedback.nomLigne || ''}
              name="nomLigne"
              onChange={handleChange}
              required
              type="text"
              value={formData.nomLigne}
            />
          </label>

          <label>
            Description
            <textarea
              className={inputFeedback.description || ''}
              name="description"
              onChange={handleChange}
              rows="3"
              value={formData.description}
            />
          </label>

          <label>
            Bus
            <select
              name="idBus"
              onChange={handleChange}
              value={formData.idBus}
            >
              <option value="">No bus</option>
              {busList.map((bus) => (
                <option key={bus.idBus} value={bus.idBus}>
                  {bus.matricule}
                </option>
              ))}
            </select>
          </label>

          <label>
            Chauffeur
            <select
              name="idChauffeur"
              onChange={handleChange}
              value={formData.idChauffeur}
            >
              <option value="">No chauffeur</option>
              {chauffeurs.map((chauffeur) => (
                <option
                  key={chauffeur.idChauffeur}
                  value={chauffeur.idChauffeur}
                >
                  {`${chauffeur.prenom ?? ''} ${chauffeur.nom ?? ''}`.trim()}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions">
            <button
              className="button button--primary"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? 'Saving...'
                : editingLigneId !== null
                  ? 'Update Ligne'
                  : 'Create Ligne'}
            </button>
            {editingLigneId !== null && (
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
            <h2>Lignes</h2>
            <button
              className="button button--secondary"
              disabled={isLoading}
              onClick={loadLignes}
              type="button"
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="status-card" role="status">
              Loading lines...
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom ligne</th>
                    <th>Description</th>
                    <th>Bus</th>
                    <th>Chauffeur</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.length === 0 ? (
                    <tr>
                      <td colSpan="6">No lines found.</td>
                    </tr>
                  ) : (
                    lignes.map((ligne) => (
                      <tr key={ligne.idLigne}>
                        <td>{ligne.idLigne}</td>
                        <td>{ligne.nomLigne}</td>
                        <td>{ligne.description ?? '-'}</td>
                        <td>{getBusLabel(ligne.idBus)}</td>
                        <td>{getChauffeurLabel(ligne.idChauffeur)}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              className="button button--secondary"
                              onClick={() => handleEdit(ligne)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="button button--danger"
                              disabled={deletingLigneId === ligne.idLigne}
                              onClick={() => handleDelete(ligne)}
                              type="button"
                            >
                              {deletingLigneId === ligne.idLigne
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

      <section className="admin-relation-section">
        <div className="section-header">
          <div>
            <h2>Gestion des arrets de la ligne</h2>
            <p>Select a line, then attach stops with their order.</p>
          </div>
        </div>

        {ligneArretError && (
          <div className="status-card status-card--error" role="alert">
            {ligneArretError}
          </div>
        )}

        <div className="admin-crud-grid">
          <form className="crud-form" onSubmit={handleLigneArretSubmit}>
            <h2>Attach Arret</h2>

            <label>
              Ligne
              <select
                name="selectedLigneId"
                onChange={handleSelectedLigneChange}
                value={selectedLigneId}
              >
                <option value="">Select a line</option>
                {lignes.map((ligne) => (
                  <option key={ligne.idLigne} value={ligne.idLigne}>
                    {ligne.nomLigne}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Arret
              <select
                disabled={!selectedLigneId}
                name="idArret"
                onChange={handleLigneArretChange}
                required
                value={ligneArretForm.idArret}
              >
                <option value="">Select a stop</option>
                {arrets.map((arret) => (
                  <option key={arret.idArret} value={arret.idArret}>
                    {arret.nomArret}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Ordre
              <input
                className={ligneArretInputFeedback.ordre || ''}
                disabled={!selectedLigneId}
                min="1"
                name="ordre"
                onChange={handleLigneArretChange}
                required
                step="1"
                type="number"
                value={ligneArretForm.ordre}
              />
            </label>

            <div className="form-actions">
              <button
                className="button button--primary"
                disabled={!selectedLigneId || isLigneArretSubmitting}
                type="submit"
              >
                {isLigneArretSubmitting ? 'Adding...' : 'Add Arret'}
              </button>
            </div>
          </form>

          <div className="table-panel">
            <div className="table-panel__header">
              <h2>
                {selectedLigneId
                  ? `Arrets - ${getLigneLabel(Number(selectedLigneId))}`
                  : 'Arrets de la ligne'}
              </h2>
              <button
                className="button button--secondary"
                disabled={!selectedLigneId || isLigneArretsLoading}
                onClick={() => loadSelectedLigneArrets(selectedLigneId)}
                type="button"
              >
                Refresh
              </button>
            </div>

            {!selectedLigneId ? (
              <div className="status-card">Select a line to view its stops.</div>
            ) : isLigneArretsLoading ? (
              <div className="status-card" role="status">
                Loading line stops...
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Arret</th>
                      <th>Ordre</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLigneArrets.length === 0 ? (
                      <tr>
                        <td colSpan="4">No stops attached to this line.</td>
                      </tr>
                    ) : (
                      selectedLigneArrets.map((ligneArret) => (
                        <tr key={ligneArret.idLigneArret}>
                          <td>{ligneArret.idLigneArret}</td>
                          <td>{getArretLabel(ligneArret.idArret)}</td>
                          <td>{ligneArret.ordre}</td>
                          <td>
                            <button
                              className="button button--danger"
                              disabled={
                                deletingLigneArretId ===
                                ligneArret.idLigneArret
                              }
                              onClick={() => handleLigneArretDelete(ligneArret)}
                              type="button"
                            >
                              {deletingLigneArretId ===
                              ligneArret.idLigneArret
                                ? 'Removing...'
                                : 'Remove'}
                            </button>
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

      <section className="admin-relation-section map-builder-section">
        <div className="section-header map-builder-header">
          <div>
            <h2>Créer un trajet sur la carte</h2>
            <p>
              Selectionnez une ligne, cliquez sur la carte, puis enregistrez
              les arrets dans l ordre du trajet.
            </p>
          </div>
          <button
            className="button button--secondary"
            disabled={!selectedLigneId || isLigneArretsLoading}
            onClick={handleRefreshTrajet}
            type="button"
          >
            Actualiser le trajet
          </button>
        </div>

        {mapBuilderError && (
          <div className="status-card status-card--error" role="alert">
            {mapBuilderError}
          </div>
        )}

        {mapBuilderStatus && !mapBuilderError && (
          <div className="status-card" role="status">
            {mapBuilderStatus}
          </div>
        )}

        <div className="map-builder-toolbar">
          <label>
            Ligne a construire
            <select
              name="selectedLigneId"
              onChange={handleSelectedLigneChange}
              value={selectedLigneId}
            >
              <option value="">Selectionnez une ligne</option>
              {lignes.map((ligne) => (
                <option key={ligne.idLigne} value={ligne.idLigne}>
                  {ligne.nomLigne}
                </option>
              ))}
            </select>
          </label>
          <span className="map-builder-counter">
            {selectedRouteStops.length} arret
            {selectedRouteStops.length > 1 ? 's' : ''} dans le trajet
          </span>
        </div>

        {!selectedLigneId && (
          <div className="status-card">
            Selectionnez ou creez une ligne avant d ajouter des arrets sur la
            carte.
          </div>
        )}

        <div className="map-builder-grid">
          <section className="map-panel map-builder-map" aria-label="Carte de creation du trajet">
            <MapView
              center={safiMapCenter}
              onMapClick={handleMapClick}
              onStopAction={handleLigneArretDelete}
              showPath={selectedRouteStops.length > 1}
              showStopOrder
              stopActionLabel="Supprimer un arrêt de la ligne"
              stops={selectedRouteStops}
              temporaryStops={temporaryMapStops}
              zoom={13}
            />
          </section>

          <aside className="map-builder-side">
            {pendingMapStop ? (
              <form className="map-stop-form" onSubmit={handlePendingMapStopSubmit}>
                <h3>Nouvel arret</h3>
                <label>
                  Nom de l arret
                  <input
                    autoFocus
                    className={mapStopInputFeedback.nomArret || ''}
                    name="nomArret"
                    onChange={handlePendingMapStopNameChange}
                    required
                    type="text"
                    value={pendingMapStopName}
                  />
                </label>
                <label>
                  Adresse
                  <input
                    className={mapStopInputFeedback.adresse || ''}
                    name="adresse"
                    onChange={handlePendingMapStopAddressChange}
                    type="text"
                    value={pendingMapStopAddress}
                  />
                </label>
                <div className="map-stop-coordinates">
                  <span>Latitude: {pendingMapStop.latitude.toFixed(6)}</span>
                  <span>Longitude: {pendingMapStop.longitude.toFixed(6)}</span>
                  <span>Ordre: {pendingMapStop.ordre}</span>
                </div>
                <div className="form-actions">
                  <button
                    className="button button--primary"
                    disabled={isMapStopSubmitting}
                    type="submit"
                  >
                    {isMapStopSubmitting ? 'Enregistrement...' : 'Enregistrer l arret'}
                  </button>
                  <button
                    className="button button--secondary"
                    disabled={isMapStopSubmitting}
                    onClick={handleCancelPendingMapStop}
                    type="button"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            ) : (
              <div className="status-card map-builder-hint">
                Cliquez sur la carte pour placer le prochain arret de la ligne.
              </div>
            )}

            <div className="ordered-stops-panel">
              <h3>Arrets du trajet</h3>
              {isLigneArretsLoading ? (
                <div className="status-card" role="status">
                  Chargement du trajet...
                </div>
              ) : selectedRouteStops.length === 0 ? (
                <div className="status-card">
                  Aucun arret dans cette ligne pour le moment.
                </div>
              ) : (
                <ol className="ordered-stop-list">
                  {selectedRouteStops.map((stop) => (
                    <li key={stop.idLigneArret}>
                      <div>
                        <span className="stop-order">#{stop.ordre}</span>
                        <strong>{stop.nomArret}</strong>
                        <small>
                          {Number(stop.latitude).toFixed(6)}, {Number(stop.longitude).toFixed(6)}
                        </small>
                      </div>
                      <button
                        className="button button--danger"
                        disabled={deletingLigneArretId === stop.idLigneArret}
                        onClick={() => handleLigneArretDelete(stop)}
                        type="button"
                      >
                        {deletingLigneArretId === stop.idLigneArret
                          ? 'Suppression...'
                          : 'Supprimer un arrêt de la ligne'}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </aside>
        </div>
      </section>
    </section>
  )
}

export default GestionLignes
