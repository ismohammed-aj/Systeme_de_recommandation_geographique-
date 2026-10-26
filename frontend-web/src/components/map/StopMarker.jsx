import L from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

const selectedStopIcon = L.divIcon({
  className: 'selected-stop-marker',
  html: '<span></span>',
  iconAnchor: [14, 14],
  iconSize: [28, 28],
  popupAnchor: [0, -14],
})

const temporaryStopIcon = L.divIcon({
  className: 'temporary-stop-marker',
  html: '<span></span>',
  iconAnchor: [14, 14],
  iconSize: [28, 28],
  popupAnchor: [0, -14],
})

const getPosition = (value) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value) && value.length === 2) {
    const latitude = Number(value[0])
    const longitude = Number(value[1])

    return Number.isFinite(latitude) && Number.isFinite(longitude)
      ? [latitude, longitude]
      : null
  }

  const latitude = Number(value.latitude ?? value.latitudeArret ?? value.lat)
  const longitude = Number(value.longitude ?? value.longitudeArret ?? value.lng)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return [latitude, longitude]
}

const getStopPosition = (stop) => getPosition(stop)

const getStopName = (stop, fallbackName) =>
  stop?.nomArret ?? stop?.name ?? stop?.libelle ?? fallbackName

const getStopOrder = (stop) => {
  const ordre = Number(stop?.ordre)

  return Number.isFinite(ordre) ? ordre : null
}

function StopMarker({
  actionLabel = '',
  name = 'Arret',
  onAction,
  position,
  selected = false,
  showOrder = false,
  stop,
  temporary = false,
}) {
  const markerPosition = getPosition(position) ?? getStopPosition(stop)

  if (!markerPosition) {
    return null
  }

  const stopOrder = getStopOrder(stop)
  const markerIcon = temporary
    ? temporaryStopIcon
    : selected
      ? selectedStopIcon
      : undefined
  const markerProps = markerIcon ? { icon: markerIcon } : {}

  return (
    <Marker position={markerPosition} {...markerProps}>
      <Popup>
        <strong>{getStopName(stop, name)}</strong>
        {selected && <span className="popup-note">Recommended stop</span>}
        {temporary && <span className="popup-note">Arret en cours</span>}
        {showOrder && stopOrder != null && (
          <span className="popup-note">Ordre {stopOrder}</span>
        )}
        {typeof onAction === 'function' && actionLabel && (
          <button
            className="popup-action-button"
            onClick={() => onAction(stop)}
            type="button"
          >
            {actionLabel}
          </button>
        )}
      </Popup>
    </Marker>
  )
}

export default StopMarker
