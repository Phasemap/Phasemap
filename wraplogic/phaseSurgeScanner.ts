import { fetchRecentCandles } from "@/api/phasemap/dataFeed"

export interface PhaseCandle {
  timestamp: number
  price: number
  volume: number
}

export async function scanPhaseSurge(tokenMint: string): Promise<{
  surgeDetected: boolean
  priceDelta: number
}> {
  const candles: PhaseCandle[] = await fetchRecentCandles(tokenMint, 8)
  if (candles.length < 2) return { surgeDetected: false, priceDelta: 0 }

  const first = candles[0]
  const last = candles[candles.length - 1]
  const priceDelta = (last.price - first.price) / first.price

  const surgeDetected = priceDelta > 0.25
  return {
    surgeDetected,
    priceDelta: parseFloat(priceDelta.toFixed(4))
  }
}