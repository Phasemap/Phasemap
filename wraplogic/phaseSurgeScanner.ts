import { fetchRecentCandles } from "@/api/phasemap/dataFeed"

export interface PhaseCandle {
  timestamp: number
  price: number
  volume: number
}

export interface SurgeScanResult {
  surgeDetected: boolean
  priceDelta: number
  volumeDelta: number
  averageVolume: number
  peakVolumeCandle: PhaseCandle
  firstCandle: PhaseCandle
  lastCandle: PhaseCandle
}

export interface ScanOptions {
  candleCount: number
  priceThreshold: number    // relative change needed to trigger price surge
  volumeThreshold: number   // relative change needed to trigger volume surge
  retryCount: number
  retryDelayMs: number
}

/**
 * Scans recent phase candles for price or volume surges.
 * @param tokenMint - mint address of the token to scan
 * @param optsOverrides - partial overrides for scan options
 */
export async function scanPhaseSurge(
  tokenMint: string,
  optsOverrides: Partial<ScanOptions> = {}
): Promise<SurgeScanResult> {
  const opts: ScanOptions = {
    candleCount: 8,
    priceThreshold: 0.25,
    volumeThreshold: 0.5,
    retryCount: 3,
    retryDelayMs: 300,
    ...optsOverrides
  }

  let candles: PhaseCandle[] = []
  let attempt = 0
  let lastError: any

  // retry logic for fetching candles
  while (attempt < opts.retryCount) {
    try {
      candles = await fetchRecentCandles(tokenMint, opts.candleCount)
      break
    } catch (err) {
      lastError = err
      attempt++
      if (attempt < opts.retryCount) {
        await new Promise(res => setTimeout(res, opts.retryDelayMs))
      }
    }
  }

  if (!candles || candles.length < 2) {
    throw new Error(
      `Unable to fetch sufficient candles for ${tokenMint}: ${lastError ?? "insufficient data"}`
    )
  }

  const first = candles[0]
  const last = candles[candles.length - 1]

  const priceDelta = (last.price - first.price) / first.price
  const volumeDelta = (last.volume - first.volume) / first.volume

  // compute average volume
  const totalVolume = candles.reduce((sum, c) => sum + c.volume, 0)
  const averageVolume = totalVolume / candles.length

  // find candle with peak volume
  const peakVolumeCandle = candles.reduce((prev, curr) =>
    curr.volume > prev.volume ? curr : prev
  )

  const surgeDetected =
    priceDelta > opts.priceThreshold || volumeDelta > opts.volumeThreshold

  return {
    surgeDetected,
    priceDelta: parseFloat(priceDelta.toFixed(4)),
    volumeDelta: parseFloat(volumeDelta.toFixed(4)),
    averageVolume: parseFloat(averageVolume.toFixed(2)),
    peakVolumeCandle,
    firstCandle: first,
    lastCandle: last
  }
}
