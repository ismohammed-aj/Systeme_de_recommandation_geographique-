import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllWithArrets } from '../../api/ligneApi'
import { getBestLineByPosition } from '../../api/recommendationApi'
import { shareMyPosition } from '../../api/stagiaireApi'
import MapView from '../../components/map/MapView'

const safiMapCenter = [32.2994, -9.2372]

const geolocationOptions = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 12000,
}

const geolocationUnsupportedMessage =
  "La geolocalisation n'est pas prise en charge par ce navigateur."

const requestCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({ message: geolocationUnsupportedMessage })
      return
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      geolocationOptions,
    )
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

const getLocationErrorMessage = (locationError) => {
  if (locationError?.message === geolocationUnsupportedMessage) {
    return geolocationUnsupportedMessage
  }

  if (locationError?.code === 1) {
    return "Permission refusee. Autorisez l'acces a votre position pour recevoir une recommandation."
  }

  if (locationError?.code === 2) {
    return 'Position indisponible. Verifiez que le GPS ou le service de localisation est active.'
  }

  if (locationError?.code === 3) {
    return 'La localisation a pris trop de temps. Reessayez dans quelques instants.'
  }

  return 'Impossible de recuperer votre position actuelle.'
}

const getRequestErrorMessage = (requestError) => {
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

  return 'Impossible de charger les donnees. Reessayez plus tard.'
}

const getErrorMessage = (error) => {
  if (
    error?.message === geolocationUnsupportedMessage ||
    [1, 2, 3].includes(error?.code)
  ) {
    return getLocationErrorMessage(error)
  }

  return getRequestErrorMessage(error)
}

const formatCoordinate = (value) => {
  const coordinate = Number(value)

  return Number.isFinite(coordinate)
    ? coordinate.toFixed(6)
    : 'Non disponible'
}

const formatDistance = (value) => {
  const distance = Number(value)

  return Number.isFinite(distance) ? distance.toFixed(2) : value
}

const normalizeStop = (stop, index = 0) => {
  const latitude = Number(stop?.latitude ?? stop?.latitudeArret)
  const longitude = Number(stop?.longitude ?? stop?.longitudeArret)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const ordre = Number(stop?.ordre)

  return {
    ...stop,
    idArret: stop?.idArret,
    nomArret: stop?.nomArret ?? stop?.name ?? `Arret ${index + 1}`,
    latitude,
    longitude,
    ordre: Number.isFinite(ordre) ? ordre : index + 1,
  }
}

const normalizeLine = (line) => ({
  ...line,
  stops: getItemsFromResponse(line?.stops ?? line?.arrets)
    .map(normalizeStop)
    .filter(Boolean)
    .sort((firstStop, secondStop) => firstStop.ordre - secondStop.ordre),
})

const getPosition = (value) => {
  const stop = normalizeStop(value)

  return stop ? [stop.latitude, stop.longitude] : null
}

const getNearestStop = (recommendation) => {
  if (!recommendation) {
    return null
  }

  const stops = getItemsFromResponse(recommendation.stops)
    .map(normalizeStop)
    .filter(Boolean)
  const nearestStop = stops.find(
    (stop) => String(stop.idArret) === String(recommendation.idArret),
  )

  return (
    nearestStop ??
    normalizeStop({
      idArret: recommendation.idArret,
      latitude: recommendation.latitudeArret,
      longitude: recommendation.longitudeArret,
      nomArret: recommendation.nomArret,
      ordre: 1,
    })
  )
}

function DashboardStagiaire() {
  const [lines, setLines] = useState([])
  const [recommendation, setRecommendation] = useState(null)
  const [userPosition, setUserPosition] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLinesLoading, setIsLinesLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [linesError, setLinesError] = useState('')

  useEffect(() => {
    const loadLines = async () => {
      try {
        setIsLinesLoading(true)
        setLinesError('')

        const response = await getAllWithArrets()
        setLines(getItemsFromResponse(response.data).map(normalizeLine))
      } catch (requestError) {
        setLines([])
        setLinesError(getRequestErrorMessage(requestError))
      } finally {
        setIsLinesLoading(false)
      }
    }

    loadLines()
  }, [])

  const handleSharePosition = async () => {
    try {
      setIsLoading(true)
      setStatusMessage(
        'Autorisez la localisation dans votre navigateur pour continuer.',
      )
      setError('')
      setRecommendation(null)

      const position = await requestCurrentPosition()
      const nextUserPosition = {
        latitude: Number(position.coords.latitude),
        longitude: Number(position.coords.longitude),
      }

      setUserPosition(nextUserPosition)
      setStatusMessage('Position recue. Enregistrement du partage GPS...')

      await shareMyPosition(nextUserPosition)

      setStatusMessage('Position enregistree. Recherche de la meilleure ligne...')

      const response = await getBestLineByPosition(
        nextUserPosition.latitude,
        nextUserPosition.longitude,
      )

      setRecommendation(response.data)
    } catch (requestError) {
      setRecommendation(null)
      setError(getErrorMessage(requestError))
    } finally {
      setIsLoading(false)
      setStatusMessage('')
    }
  }

  const nearestStop = getNearestStop(recommendation)
  const recommendationLine = useMemo(() => {
    if (!recommendation) {
      return null
    }

    const existingLine = lines.find(
      (line) => String(line.idLigne) === String(recommendation.idLigne),
    )

    return (
      existingLine ??
      normalizeLine({
        idLigne: recommendation.idLigne,
        nomLigne: recommendation.nomLigne,
        stops: recommendation.stops,
      })
    )
  }, [lines, recommendation])
  const visibleLines = useMemo(() => {
    if (
      recommendationLine &&
      !lines.some((line) => String(line.idLigne) === String(recommendationLine.idLigne))
    ) {
      return [...lines, recommendationLine]
    }

    return lines
  }, [lines, recommendationLine])
  const mapCenter = getPosition(nearestStop) ?? getPosition(userPosition) ?? safiMapCenter
  const distance = formatDistance(recommendation?.distance)

  return (
    <section className="page stagiaire-dashboard-page">
      <div className="dashboard-card">
        <div className="page-header">
          <div>
            <h1>Espace Stagiaire</h1>
            <p>Consultez les lignes et partagez votre position GPS.</p>
          </div>
          <Link className="text-link" to="/stagiaire/recommendation">
            Recommandation
          </Link>
        </div>

        <div className="form-actions">
          <button
            className="button button--primary"
            disabled={isLoading}
            onClick={handleSharePosition}
            type="button"
          >
            Partager ma position
          </button>
          <Link className="button button--secondary" to="/stagiaire/recommendation">
            Voir la page recommendation
          </Link>
        </div>

        {statusMessage && (
          <div className="status-card" role="status">
            {statusMessage}
          </div>
        )}

        {isLinesLoading && (
          <div className="status-card" role="status">
            Chargement des lignes disponibles...
          </div>
        )}

        {linesError && (
          <div className="status-card status-card--error" role="alert">
            {linesError}
          </div>
        )}

        {userPosition && (
          <div className="status-card location-card">
            <span>Position actuelle</span>
            <strong>Latitude: {formatCoordinate(userPosition.latitude)}</strong>
            <strong>Longitude: {formatCoordinate(userPosition.longitude)}</strong>
          </div>
        )}

        {error && (
          <div className="status-card status-card--error" role="alert">
            {error}
          </div>
        )}

        <div className="dashboard-recommendation-layout">
          <article className="dashboard-result">
            <span className="eyebrow">
              {recommendation ? 'Resultat' : 'Lignes disponibles'}
            </span>
            {recommendation ? (
              <dl className="recommendation-details">
                <div>
                  <dt>Meilleure ligne</dt>
                  <dd>{recommendation.nomLigne}</dd>
                </div>
                <div>
                  <dt>Arret le plus proche</dt>
                  <dd>{recommendation.nomArret}</dd>
                </div>
                <div>
                  <dt>Distance</dt>
                  <dd>{distance} km</dd>
                </div>
              </dl>
            ) : (
              <p>
                {visibleLines.length} ligne
                {visibleLines.length > 1 ? 's' : ''} affichee
                {visibleLines.length > 1 ? 's' : ''} sur la carte.
              </p>
            )}
          </article>

          <section className="map-panel dashboard-map" aria-label="Carte des lignes disponibles">
            <MapView
              center={mapCenter}
              lines={visibleLines}
              recommendedStop={nearestStop}
              selectedLine={recommendationLine}
              userPosition={userPosition}
              zoom={13}
            />
          </section>
        </div>
      </div>
    </section>
  )
}

export default DashboardStagiaire
