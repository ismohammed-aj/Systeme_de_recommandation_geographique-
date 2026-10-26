import { Polyline } from 'react-leaflet'

const getStopPosition = (stop) => {
  if (!stop) {
    return null
  }

  const latitude = Number(stop.latitude ?? stop.latitudeArret ?? stop.lat)
  const longitude = Number(stop.longitude ?? stop.longitudeArret ?? stop.lng)

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  return [latitude, longitude]
}

const getStopOrder = (stop) => {
  const ordre = Number(stop?.ordre)

  return Number.isFinite(ordre) ? ordre : Number.MAX_SAFE_INTEGER
}

const getOrderedStops = (stops) =>
  stops
    .map((stop, index) => ({ index, stop }))
    .sort((first, second) => {
      const orderDifference =
        getStopOrder(first.stop) - getStopOrder(second.stop)

      return orderDifference === 0 ? first.index - second.index : orderDifference
    })
    .map(({ stop }) => stop)

function LinePath({
  color = '#166534',
  opacity = 0.85,
  positions = [],
  stops = [],
  weight = 4,
}) {
  const safePositions = Array.isArray(positions) ? positions : []
  const safeStops = Array.isArray(stops) ? stops : []
  const pathPositions =
    safePositions.length > 0
      ? safePositions
          .map((position) => {
            if (!Array.isArray(position) || position.length !== 2) {
              return null
            }

            const latitude = Number(position[0])
            const longitude = Number(position[1])

            return Number.isFinite(latitude) && Number.isFinite(longitude)
              ? [latitude, longitude]
              : null
          })
          .filter(Boolean)
      : getOrderedStops(safeStops).map(getStopPosition).filter(Boolean)

  if (pathPositions.length < 2) {
    return null
  }

  return (
    <Polyline
      positions={pathPositions}
      pathOptions={{ color, opacity, weight }}
    />
  )
}

export default LinePath
