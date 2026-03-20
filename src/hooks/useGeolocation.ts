import { useState, useCallback } from 'react'

interface GeoState {
  lat: number | null
  lng: number | null
  loading: boolean
  error: string | null
  granted: boolean
}

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({
    lat: null,
    lng: null,
    loading: false,
    error: null,
    granted: false,
  })

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported by your browser' }))
      return
    }

    setState(s => ({ ...s, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          loading: false,
          error: null,
          granted: true,
        })
      },
      (err) => {
        setState(s => ({
          ...s,
          loading: false,
          error: err.code === 1
            ? 'Location permission denied'
            : 'Unable to get your location',
        }))
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    )
  }, [])

  const setManualLocation = useCallback((lat: number, lng: number) => {
    setState({ lat, lng, loading: false, error: null, granted: true })
  }, [])

  return { ...state, requestLocation, setManualLocation }
}
