import type { PaymentSplit } from '../types'

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export function generatePlayerId(): string {
  return crypto.randomUUID()
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!]
  }
  return shuffled
}

export function randomPaymentSplit(): PaymentSplit {
  return pickRandom<PaymentSplit>(['100/0', '75/25', '60/40', '50/50'])
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function formatPaymentSplit(split: PaymentSplit): { winner: string; loser: string } {
  const [loserPct, winnerPct] = split.split('/') as [string, string]
  return { winner: `${winnerPct}%`, loser: `${loserPct}%` }
}

export function getShareUrl(roomCode: string): string {
  return `${window.location.origin}?room=${roomCode}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
