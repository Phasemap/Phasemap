import { TokenVectorFeatures } from "./vectorFeatureEngine"

export class MarketTrendOracle {
  assessTrend(features: TokenVectorFeatures): string {
    const { movingAvgShort, movingAvgLong, volatilityIndex, liquidityChangeRatio } = features

    if (movingAvgShort > movingAvgLong * 1.05 && volatilityIndex < 0.05) {
      return "Uptrend forming with low volatility"
    }

    if (movingAvgShort < movingAvgLong * 0.95 && liquidityChangeRatio < -0.2) {
      return "Downtrend with negative liquidity pressure"
    }

    if (volatilityIndex > 0.15) {
      return "Volatile zone — uncertain trend"
    }

    return "Sideways or neutral trend detected"
  }
}
