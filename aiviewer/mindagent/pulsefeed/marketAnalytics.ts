import fetch from "node-fetch"

interface TradeTick {
  timestamp: number     
  price: number        
  size: number          
}

interface TradeStats {
  vwap: number
  sma: number
  volatility: number
  recentVolume: number
  pumpScore: number
  summary: string
}

export class MarketAnalytics {
  constructor(private readonly apiUrl: string) {}

  async fetchTradeHistory(marketSymbol: string, limit = 100): Promise<TradeTick[]> {
    const url = `${this.apiUrl}/markets/${marketSymbol}/trades?limit=${limit}`
    const res = await fetch(url, { method: "GET", timeout: 10_000 })
    if (!res.ok) throw new Error(`Fetch error ${res.status}: ${res.statusText}`)
    return (await res.json()) as TradeTick[]
  }

  calculateVWAP(ticks: TradeTick[]): number {
    const { pvSum, volSum } = ticks.reduce(
      (acc, t) => {
        acc.pvSum += t.price * t.size
        acc.volSum += t.size
        return acc
      },
      { pvSum: 0, volSum: 0 }
    )
    return volSum > 0 ? pvSum / volSum : 0
  }

  simpleMovingAverage(ticks: TradeTick[], window = 20): number {
    const slice = ticks.slice(-window)
    const sum = slice.reduce((acc, t) => acc + t.price, 0)
    return slice.length ? sum / slice.length : 0
  }

  calculateVolatility(ticks: TradeTick[]): number {
    const mean = this.simpleMovingAverage(ticks)
    const variance = ticks.reduce((acc, t) => acc + Math.pow(t.price - mean, 2), 0) / ticks.length
    return Math.sqrt(variance)
  }

  recentVolume(ticks: TradeTick[], withinMs = 300_000): number {
    const now = Date.now()
    return ticks.filter(t => now - t.timestamp <= withinMs).reduce((sum, t) => sum + t.size, 0)
  }

  pumpDetectionScore(ticks: TradeTick[]): number {
    const buyVolume = ticks.filter(t => t.side === "buy").reduce((sum, t) => sum + t.size, 0)
    const sellVolume = ticks.filter(t => t.side === "sell").reduce((sum, t) => sum + t.size, 0)
    const ratio = buyVolume / (sellVolume + 1e-6)
    return Math.min(1, ratio / 2) // score capped at 1
  }

  async analyzeMarket(marketSymbol: string): Promise<TradeStats> {
    const ticks = await this.fetchTradeHistory(marketSymbol, 100)
    const vwap = this.calculateVWAP(ticks)
    const sma = this.simpleMovingAverage(ticks)
    const volatility = this.calculateVolatility(ticks)
    const volume = this.recentVolume(ticks)
    const pumpScore = this.pumpDetectionScore(ticks)

    const summary =
      pumpScore > 0.8
        ? "⚠️ Possible pump behavior"
        : volatility > 1.5
        ? "🚧 High volatility"
        : "✅ Stable market"

    return {
      vwap,
      sma,
      volatility: Number(volatility.toFixed(4)),
      recentVolume: Number(volume.toFixed(2)),
      pumpScore: Number(pumpScore.toFixed(3)),
      summary
    }
  }

  async detectArbitrage(marketA: string, marketB: string): Promise<number> {
    const [aTicks, bTicks] = await Promise.all([
      this.fetchTradeHistory(marketA),
      this.fetchTradeHistory(marketB),
    ])
    return Number((this.calculateVWAP(aTicks) - this.calculateVWAP(bTicks)).toFixed(6))
  }
}
