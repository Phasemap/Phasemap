export interface PulsePricePoint {
  timestamp: number
  price: number
}

export function getPhaseVolatility(data: PulsePricePoint[], window = 5): number {
  if (data.length < window) return 0

  const recent = data.slice(-window)
  const mean = recent.reduce((acc, p) => acc + p.price, 0) / recent.length

  const variance = recent.reduce((acc, p) => acc + Math.pow(p.price - mean, 2), 0) / recent.length
  return parseFloat(Math.sqrt(variance).toFixed(6))
}

export function classifyVolatility(vol: number): string {
  if (vol > 0.15) return "🚨 HIGH"
  if (vol > 0.07) return "⚠️ MEDIUM"
  return "🟢 LOW"
}