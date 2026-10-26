import { useCallback, useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { Marker, Popup, useMap } from 'react-leaflet'
import { getSharedPositions } from '../../api/stagiaireApi'
import MapView from '../../components/map/MapView'

const safiMapCenter = [32.2994, -9.2372]

const stagiairePositionIcon = L.divIcon({
  className: 'stagiaire-position-marker',
  html: '<span></span>',
  iconAnchor: [13, 13],
  iconSize: [26, 26],
  popupAnchor: [0, -13],
})

const getItemsFromResponse = (data) => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.content)) {
    return data.content
  }

  return []
}

const getErrorMessage = (requestError) => {
  const responseData = requestError?.response?.data

  if (responseData?.errors) {
    return Object.values(responseData.errors).join(' ')
  }

  if (responseData?.message) {
    return responseData.message
  }

  if (requestError?.request) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion internet ou réessayez plus tard.'
  }

  return 'Impossible de charger les positions des stagiaires.'
}

const formatCoordinate = (value) => {
  const coordinate = Number(value)

  return Number.isFinite(coordinate)
    ? coordinate.toFixed(6)
    : 'Non disponible'
}

const formatDateTime = (value) => {
  if (!value) {
    return 'Non disponible'
  }

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(date)
}

const getDisplayName = (stagiaire) => {
  const fullName = [stagiaire?.prenom, stagiaire?.nom]
    .filter(Boolean)
    .join(' ')
    .trim()

  return fullName || `Stagiaire ${stagiaire?.idStagiaire ?? ''}`.trim()
}

const normalizeStagiaire = (stagiaire) => {
  const latitude = Number(stagiaire?.latitude)
  const longitude = Number(stagiaire?.longitude)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return {
    ...stagiaire,
    displayName: getDisplayName(stagiaire),
    latitude,
    longitude,
  }
}

function FitStagiaireBounds({ stagiaires }) {
  const map = useMap()

  useEffect(() => {
    if (stagiaires.length === 0) {
      return
    }

    const bounds = L.latLngBounds(
      stagiaires.map((stagiaire) => [stagiaire.latitude, stagiaire.longitude]),
    )

    if (!bounds.isValid()) {
      return
    }

    if (stagiaires.length === 1) {
      map.setView(bounds.getCenter(), 14)
      return
    }

    map.fitBounds(bounds, {
      maxZoom: 15,
      padding: [36, 36],
    })
  }, [map, stagiaires])

  return null
}

function StagiaireMarker({ stagiaire }) {
  return (
    <Marker
      icon={stagiairePositionIcon}
      position={[stagiaire.latitude, stagiaire.longitude]}
    >
      <Popup>
        <div className="stagiaire-popup">
          <strong className="stagiaire-popup__name">
            {stagiaire.displayName}
          </strong>

          {stagiaire.email && (
            <span className="stagiaire-popup__email">{stagiaire.email}</span>
          )}

          <dl className="stagiaire-popup__details">
            <div>
              <dt>Latitude</dt>
              <dd>{formatCoordinate(stagiaire.latitude)}</dd>
            </div>
            <div>
              <dt>Longitude</dt>
              <dd>{formatCoordinate(stagiaire.longitude)}</dd>
            </div>
            <div>
              <dt>Derniere mise a jour</dt>
              <dd>{formatDateTime(stagiaire.lastPositionUpdate)}</dd>
            </div>
          </dl>
        </div>
      </Popup>
    </Marker>
  )
}

function GestionStagiaires() {
  const [stagiaires, setStagiaires] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadStagiaires = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await getSharedPositions()
      setStagiaires(
        getItemsFromResponse(response.data)
          .map(normalizeStagiaire)
          .filter(Boolean),
      )
    } catch (requestError) {
      setStagiaires([])
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(loadStagiaires, 0)

    return () => window.clearTimeout(timeoutId)
  }, [loadStagiaires])

  const mapCenter = useMemo(
    () =>
      stagiaires[0]
        ? [stagiaires[0].latitude, stagiaires[0].longitude]
        : safiMapCenter,
    [stagiaires],
  )

  return (
    <section className="page admin-stagiaires-page">
      <div className="page-header">
        <div>
          <h1>Gestion des Stagiaires</h1>
          <p>Visualisez uniquement les stagiaires ayant active le partage GPS.</p>
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

      <div className="stagiaire-map-grid">
        <article className="dashboard-result stagiaire-summary-card">
          <span className="eyebrow">Positions actives</span>
          <h2>{stagiaires.length}</h2>
          <p>Stagiaires visibles sur la carte apres activation du GPS.</p>

          <button
            className="button button--secondary"
            disabled={isLoading}
            onClick={loadStagiaires}
            type="button"
          >
            Actualiser
          </button>
        </article>

        <section
          aria-label="Carte des positions partagees des stagiaires"
          className="map-panel stagiaires-map-panel"
        >
          <MapView center={mapCenter} zoom={13}>
            <FitStagiaireBounds stagiaires={stagiaires} />
            {stagiaires.map((stagiaire) => (
              <StagiaireMarker
                key={stagiaire.idStagiaire ?? `${stagiaire.latitude}-${stagiaire.longitude}`}
                stagiaire={stagiaire}
              />
            ))}
          </MapView>

          {isLoading && (
            <div className="status-card map-state-card" role="status">
              Chargement des positions des stagiaires...
            </div>
          )}

          {!isLoading && !error && stagiaires.length === 0 && (
            <div className="status-card map-state-card" role="status">
              Aucun stagiaire n’a partagé sa position pour le moment.
            </div>
          )}
        </section>
      </div>
    </section>
  )
}

export default GestionStagiaires
