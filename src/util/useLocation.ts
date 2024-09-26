'use client'
import React from 'react'

export function useLocation(enable: boolean) {
  const [location, setLocation] = React.useState<
    GeolocationCoordinates | null
  >(null)

  const distance = React.useCallback((
    [lon, lat]: [number, number],
    unit: 'K' | 'N' = 'K',
  ): number => {
    if (!location) return 0

    const locLat = location.latitude
    const locLon = location.longitude
    const radlat1 = Math.PI * lat / 180
    const radlat2 = Math.PI * locLat / 180
    const theta = lon - locLon
    const radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2)
      + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == 'K') dist = dist * 1.609344
    if (unit == 'N') dist = dist * 0.8684
    return dist
  }, [location])

  const getPosition = React.useCallback(() => {
    if (enable && location === null) {
      navigator
        .geolocation
        .getCurrentPosition(p => setLocation(p.coords))
    }
  }, [location])

  // React.useEffect(() => {
  //   if (enable && location === null) {
  //     navigator
  //       .geolocation
  //       .getCurrentPosition(p => setLocation(p.coords))
  //   }
  // }, [location])

  return {
    location,
    distance,
    getPosition,
  }
}
