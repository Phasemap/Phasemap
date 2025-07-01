import fetch from "node-fetch"

interface TradeEvent {
  timestamp: number
  price: number
  volume: number
  side: "buy" | "sell"
}

interface AnomalyResult {
  surgeDetected: boolean
  spikeStrength: number
  priceJump: number
  buySellImbalance: number
  timestamp: number
}

export class AnomalyTracer {
  constructor(private readonly apiUrl: string) {}

  async fetchRecentTrades(symbol: string, limit = 150): Promise<TradeEvent[]> {
    const res = await fetch(`${this.apiUrl}/markets/${symbol}/trades?limit=${limit}`, {
      timeout: 8000
    })
    if (!res.ok) throw new Error(`Failed to fetch trades: ${res.statusText}`)
    return (await res.json()) as TradeEvent[]
  }

  private volumeSurgeScore(trades: TradeEvent[]): number {
    const now = Date.now()
    const recent = trades.filter(t => now - t.timestamp < 60_000)
    const earlier = trades.filter(t => now - t.timestamp >= 60_000 && now - t.timestamp < 300_000)

    const volRecent = recent.reduce((sum, t) => sum + t.volume, 0)
    const volEarlier = earlier.reduce((sum, t) => sum + t.volume, 0)
    return volEarlier ? volRecent / volEarlier : 0
  }

  private detectPriceJump(trades: TradeEvent[]): number {
    const sorted = trades.sort((a, b) => a.timestamp - b.timestamp)
    const first = sorted[0]?.price ?? 0
    const last = sorted.at(-1)?.price ?? 0
    return first > 0 ? ((last - first) / first) * 100 : 0
  }

  private buySellSkew(trades: TradeEvent[]): number {
    const buys = trades.filter(t => t.side === "buy").reduce((s, t) => s + t.volume, 0)
    const sells = trades.filter(t => t.side === "sell").reduce((s, t) => s + t.volume, 0)
    const total = buys + sells
    return total ? (buys - sells) / total : 0
  }

  async analyze(symbol: string): Promise<AnomalyResult> {
    const trades = await this.fetchRecentTrades(symbol)

    const spike = this.volumeSurgeScore(trades)
    const jump = this.detectPriceJump(trades)
    const imbalance = this.buySellSkew(trades)

    return {
      surgeDetected: spike > 3,
      spikeStrength: Number(spike.toFixed(2)),
      priceJump: Number(jump.toFixed(2)),
      buySellImbalance: Number(imbalance.toFixed(3)),
      timestamp: Date.now()
    }
  }
}
