import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import LinePath from './LinePath'
import StopMarker from './StopMarker'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const defaultCenter = [32.886, -6.91]
const lineColors = ['#166534', '#2563eb', '#b45309', '#7c3aed', '#be123c']

const userPositionIcon = L.divIcon({
  className: 'user-position-marker',
  html: '<span></span>',
  iconAnchor: [14, 14],
  iconSize: [28, 28],
  popupAnchor: [0, -14],
})

const getStopId = (stop) =>
  stop?.idArret ?? stop?.idLigneArret ?? stop?.idStop ?? stop?.id

const getLineId = (line) => line?.idLigne ?? line?.id ?? line?.idLine

const safeArray = (value) => (Array.isArray(value) ? value : [])

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

const getValidCenter = (center, userPosition, selectedStop, stops) =>
  getPosition(center) ??
  getStopPosition(selectedStop) ??
  getPosition(userPosition) ??
  getStopPosition(safeArray(stops)[0]) ??
  defaultCenter

const isSameStop = (stop, selectedStop) => {
  if (!stop || !selectedStop) {
    return false
  }

  const stopId = getStopId(stop)
  const selectedStopId = getStopId(selectedStop)

  if (stopId != null && selectedStopId != null) {
    return String(stopId) === String(selectedStopId)
  }

  const stopPosition = getStopPosition(stop)
  const selectedPosition = getStopPosition(selectedStop)

  return (
    Boolean(stopPosition) &&
    Boolean(selectedPosition) &&
    stopPosition[0] === selectedPosition[0] &&
    stopPosition[1] === selectedPosition[1]
  )
}

const getVisibleStops = (stops, selectedStop) => {
  const validStops = safeArray(stops).filter((stop) => getStopPosition(stop))

  if (selectedStop && !validStops.some((stop) => isSameStop(stop, selectedStop))) {
    const selectedPosition = getStopPosition(selectedStop)

    if (selectedPosition) {
      return [...validStops, selectedStop]
    }
  }

  return validStops
}

const getStopOrder = (stop) => {
  const ordre = Number(stop?.ordre)

  return Number.isFinite(ordre) ? ordre : Number.MAX_SAFE_INTEGER
}

const getOrderedStops = (stops) =>
  safeArray(stops)
    .filter((stop) => getStopPosition(stop))
    .map((stop, index) => ({ index, stop }))
    .sort((first, second) => {
      const orderDifference =
        getStopOrder(first.stop) - getStopOrder(second.stop)

      return orderDifference === 0 ? first.index - second.index : orderDifference
    })
    .map(({ stop }) => stop)

const getLineStops = (line) => safeArray(line?.stops ?? line?.arrets)

const isSameLine = (line, selectedLine) => {
  if (!line || !selectedLine) {
    return false
  }

  const lineId = getLineId(line)
  const selectedLineId = getLineId(selectedLine)

  return lineId != null && selectedLineId != null
    ? String(lineId) === String(selectedLineId)
    : false
}

const getUniqueStops = (stops) => {
  const seenStops = new Set()

  return safeArray(stops).filter((stop) => {
    const position = getStopPosition(stop)
    if (!position) {
      return false
    }

    const key = getStopId(stop) ?? `${position[0]},${position[1]}`
    if (seenStops.has(key)) {
      return false
    }

    seenStops.add(key)
    return true
  })
}

function RecenterMap({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, map, zoom])

  return null
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(event) {
      if (typeof onMapClick !== 'function') {
        return
      }

      onMapClick({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
        originalEvent: event,
      })
    },
  })

  return null
}

function MapView({
  center,
  children,
  lines = [],
  onMapClick,
  onStopAction,
  recommendedStop = null,
  selectedStop = null,
  selectedLine = null,
  showPath = false,
  showStopOrder = false,
  stopActionLabel = '',
  stops = [],
  temporaryStops = [],
  userPosition = null,
  zoom = 13,
}) {
  const safeLines = safeArray(lines)
  const orderedStops = getOrderedStops(stops)
  const lineStops = safeLines.flatMap((line) => getLineStops(line))
  const highlightedStop = recommendedStop ?? selectedStop
  const visibleStops = getVisibleStops(
    getUniqueStops([...lineStops, ...orderedStops]),
    highlightedStop,
  )
  const mapCenter = getValidCenter(center, userPosition, highlightedStop, visibleStops)
  const userMarkerPosition = getPosition(userPosition)

  return (
    <MapContainer center={mapCenter} zoom={zoom} className="map-view">
      <RecenterMap center={mapCenter} zoom={zoom} />
      {typeof onMapClick === 'function' && <MapClickHandler onMapClick={onMapClick} />}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {safeLines.map((line, index) => {
        const currentLineStops = getOrderedStops(getLineStops(line))
        const selected = isSameLine(line, selectedLine)

        return (
          <LinePath
            key={getLineId(line) ?? `line-${index}`}
            color={selected ? '#dc2626' : lineColors[index % lineColors.length]}
            opacity={selected ? 0.95 : 0.55}
            stops={currentLineStops}
            weight={selected ? 6 : 4}
          />
        )
      })}
      {safeLines.length === 0 && showPath && <LinePath stops={orderedStops} />}
      {userMarkerPosition && (
        <Marker icon={userPositionIcon} position={userMarkerPosition}>
          <Popup>
            <strong>Votre position</strong>
          </Popup>
        </Marker>
      )}
      {visibleStops.map((stop, index) => (
        <StopMarker
          key={getStopId(stop) ?? `${getStopPosition(stop).join(',')}-${index}`}
          actionLabel={stopActionLabel}
          onAction={onStopAction}
          selected={isSameStop(stop, highlightedStop)}
          showOrder={showStopOrder}
          stop={stop}
        />
      ))}
      {safeArray(temporaryStops).map((stop, index) => (
        <StopMarker
          key={getStopId(stop) ?? `temporary-${index}`}
          showOrder={showStopOrder}
          stop={stop}
          temporary
        />
      ))}
      {children}
    </MapContainer>
  )
}

export default MapView
