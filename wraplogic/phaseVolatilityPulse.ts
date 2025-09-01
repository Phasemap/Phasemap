export interface PulsePricePoint {
  timestamp: number
  price: number
}

/**
 * Calculate volatility using a rolling window of price points.
 * @param data   Array of price points
 * @param window Number of most recent points to include (default 5)
 * @returns Standard deviation of recent prices
 */
export function getPhaseVolatility(data: PulsePricePoint[], window = 5): number {
  if (window <= 1 || data.length < window) return 0

  const recent = data.slice(-window)
  const mean =
    recent.reduce((acc, { price }) => acc + price, 0) / recent.length

  const variance =
    recent.reduce((acc, { price }) => acc + (price - mean) ** 2, 0) /
    (recent.length - 1)

  return Number(Math.sqrt(variance).toFixed(6))
}

/**
 * Classify volatility into categories with icons.
 */
export function classifyVolatility(vol: number): "🚨 HIGH" | "⚠️ MEDIUM" | "🟢 LOW" {
  if (vol > 0.15) return "🚨 HIGH"
  if (vol > 0.07) return "⚠️ MEDIUM"
  return "🟢 LOW"
}
