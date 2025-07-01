export interface TokenSnapshot {
  timestamp: number
  volume: number
  priceUSD: number
  liquidity: number
}

export interface TokenVectorFeatures {
  movingAvgShort: number
  movingAvgLong: number
  volatilityIndex: number
  liquidityChangeRatio: number
}

export class VectorFeatureEngine {
  constructor(private windowSize: number = 12) {}

  computeFeatures(data: TokenSnapshot[]): TokenVectorFeatures {
    const prices = data.map(d => d.priceUSD)
    const shortMA = this.avg(prices.slice(-3))
    const longMA = this.avg(prices.slice(-this.windowSize))
    const volatility = this.stdev(prices)
    const liquidityChange = this.liquidityDelta(data)

    return {
      movingAvgShort: shortMA,
      movingAvgLong: longMA,
      volatilityIndex: volatility,
      liquidityChangeRatio: liquidityChange
    }
  }

  private avg(values: number[]): number {
    const sum = values.reduce((a, b) => a + b, 0)
    return sum / values.length
  }

  private stdev(values: number[]): number {
    const mean = this.avg(values)
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
    return Math.sqrt(variance)
  }

  private liquidityDelta(data: TokenSnapshot[]): number {
    if (data.length < 2) return 0
    const initial = data[0].liquidity
    const latest = data[data.length - 1].liquidity
    return initial ? (latest - initial) / initial : 0
  }
}
