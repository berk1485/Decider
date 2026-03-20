import { corsHeaders, handleCors } from '../_shared/cors.ts'

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY') ?? ''

interface PlacesRequest {
  lat: number
  lng: number
  radius?: number
  types?: string[]
}

Deno.serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    if (!GOOGLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Google Places API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const body = (await req.json()) as PlacesRequest
    const { lat, lng, radius = 2000, types } = body

    const includedTypes = types?.length ? types : ['restaurant']

    const placesResponse = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.formattedAddress,places.location,places.priceLevel,places.types,places.photos',
      },
      body: JSON.stringify({
        includedTypes,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius,
          },
        },
        rankPreference: 'POPULARITY',
      }),
    })

    if (!placesResponse.ok) {
      const err = await placesResponse.text()
      return new Response(
        JSON.stringify({ error: `Google Places API error: ${err}` }),
        { status: placesResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const data = (await placesResponse.json()) as {
      places?: Array<{
        id: string
        displayName?: { text: string }
        rating?: number
        formattedAddress?: string
        location?: { latitude: number; longitude: number }
        priceLevel?: string
        types?: string[]
        photos?: Array<{ name: string }>
      }>
    }

    const restaurants = (data.places ?? []).map((place) => {
      const plat = place.location?.latitude ?? lat
      const plng = place.location?.longitude ?? lng
      const dist = haversine(lat, lng, plat, plng)

      const priceLevelMap: Record<string, number> = {
        PRICE_LEVEL_FREE: 0,
        PRICE_LEVEL_INEXPENSIVE: 1,
        PRICE_LEVEL_MODERATE: 2,
        PRICE_LEVEL_EXPENSIVE: 3,
        PRICE_LEVEL_VERY_EXPENSIVE: 4,
      }

      return {
        id: place.id,
        name: place.displayName?.text ?? 'Unknown',
        rating: place.rating ?? 0,
        address: place.formattedAddress ?? '',
        distance: formatDistance(dist),
        priceLevel: place.priceLevel ? priceLevelMap[place.priceLevel] : undefined,
        types: place.types,
        lat: plat,
        lng: plng,
      }
    })

    return new Response(JSON.stringify(restaurants), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Server error: ${(err as Error).message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}
