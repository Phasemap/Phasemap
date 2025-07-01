import { HeatmapReport } from "./generateTokenHeatmap"

export interface TokenHealthInput {
  heatmap: HeatmapReport
  recentSpike: boolean
  smartWalletRatio: number   // 0 to 1
  flaggedByOracle: boolean
}

export interface TokenHealthAssessment {
  healthScore: number
  tier: "Stable" | "Watchlist" | "Volatile" | "Critical"
  diagnostics: string[]
}

/**
 * Computes a health score (0–100) based on usage patterns and alerts
 */
export function computeTokenHealth(input: TokenHealthInput): TokenHealthAssessment {
  const { heatmap, recentSpike, smartWalletRatio, flaggedByOracle } = input

  const txTotal = heatmap.activity.reduce((sum, h) => sum + h.txCount, 0)
  const avgVolume = heatmap.activity.reduce((sum, h) => sum + h.totalVolume, 0) / (heatmap.activity.length || 1)
  const avgWallets = heatmap.activity.reduce((sum, h) => sum + h.uniqueWallets, 0) / (heatmap.activity.length || 1)

  let score = 0
  const diagnostics: string[] = []

  // Volume activity
  if (avgVolume > 5000) {
    score += 30
    diagnostics.push("High trading volume")
  } else if (avgVolume > 1000) {
    score += 20
    diagnostics.push("Moderate volume observed")
  } else {
    diagnostics.push("Low trading volume")
  }

  // Wallet engagement
  if (avgWallets > 50) {
    score += 20
    diagnostics.push("Diverse wallet interaction")
  } else if (avgWallets > 15) {
    score += 10
    diagnostics.push("Moderate wallet activity")
  } else {
    diagnostics.push("Low wallet diversity")
  }

  // Spike detection
  if (recentSpike) {
    score -= 15
    diagnostics.push("Recent volume spike — may indicate manipulation")
  }

  // Smart wallet saturation
  if (smartWalletRatio > 0.7) {
    score -= 20
    diagnostics.push("High smart wallet concentration")
  }

  // Oracle flagging
  if (flaggedByOracle) {
    score -= 25
    diagnostics.push("Flagged for unusual patterns by AI Oracle")
  }

  const normalizedScore = Math.max(0, Math.min(100, score))
  let tier: TokenHealthAssessment["tier"] = "Stable"
  if (normalizedScore < 30) tier = "Critical"
  else if (normalizedScore < 50) tier = "Volatile"
  else if (normalizedScore < 70) tier = "Watchlist"

  return {
    healthScore: normalizedScore,
    tier,
    diagnostics
  }
}
