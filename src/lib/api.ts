import { supabase } from './supabase'
import type { Restaurant } from '../types'

const EDGE_BASE = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : ''

async function edgeFetch<T>(fn: string, body: Record<string, unknown>): Promise<T> {
  if (!EDGE_BASE) throw new Error('Supabase not configured. Add VITE_SUPABASE_URL to .env')

  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(`${EDGE_BASE}/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      ...(session?.access_token ? { 'x-access-token': session.access_token } : {}),
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Edge function "${fn}" failed: ${res.status} ${text}`)
  }

  return res.json() as Promise<T>
}

export async function fetchNearbyRestaurants(
  lat: number,
  lng: number,
  radius: number = 2000,
  types?: string[],
): Promise<Restaurant[]> {
  return edgeFetch<Restaurant[]>('places', { lat, lng, radius, types })
}

export async function fetchAI(
  prompt: string,
  systemPrompt?: string,
): Promise<string> {
  const result = await edgeFetch<{ response: string }>('ai', { prompt, systemPrompt })
  return result.response
}

export async function fetchAIStructured<T>(
  prompt: string,
  systemPrompt: string,
): Promise<T> {
  const result = await edgeFetch<{ response: string }>('ai', {
    prompt,
    systemPrompt: systemPrompt + '\n\nRespond with valid JSON only. No markdown, no code blocks.',
  })
  return JSON.parse(result.response) as T
}
