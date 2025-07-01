export interface TokenRiskInput {
  volumeChangeRatio: number       // 0–1
  flashloanDetected: boolean
  smartWalletDensity: number      // 0–1
  sybilOverlapScore: number       // 0–1
  whalePresenceScore: number      // 0–1
  isNewlyListed: boolean
  averageSlippage: number         // 0–1
}

export enum RiskSeverity {
  Low = "Low",
  Elevated = "Elevated",
  High = "High",
  Severe = "Severe"
}

const RISK_FACTORS = {
  volumeChange: 0.2,
  flashloan: 0.25,
  smartWallets: 0.15,
  sybilOverlap: 0.1,
  whaleActivity: 0.15,
  newListing: 0.1,
  slippage: 0.05
}

export function evaluateTokenRiskScore(input: TokenRiskInput): number {
  const {
    volumeChangeRatio,
    flashloanDetected,
    smartWalletDensity,
    sybilOverlapScore,
    whalePresenceScore,
    isNewlyListed,
    averageSlippage
  } = input

  const score =
    volumeChangeRatio * RISK_FACTORS.volumeChange +
    (flashloanDetected ? 1 : 0) * RISK_FACTORS.flashloan +
    smartWalletDensity * RISK_FACTORS.smartWallets +
    sybilOverlapScore * RISK_FACTORS.sybilOverlap +
    whalePresenceScore * RISK_FACTORS.whaleActivity +
    (isNewlyListed ? 1 : 0) * RISK_FACTORS.newListing +
    averageSlippage * RISK_FACTORS.slippage

  return Math.min(100, parseFloat((score * 100).toFixed(1)))
}

export function mapRiskScoreToLabel(score: number): RiskSeverity {
  if (score >= 85) return RiskSeverity.Severe
  if (score >= 60) return RiskSeverity.High
  if (score >= 35) return RiskSeverity.Elevated
  return RiskSeverity.Low
}

export function explainRisk(severity: RiskSeverity): string {
  switch (severity) {
    case RiskSeverity.Severe:
      return "🚨 Critical anomalies detected: flashloan traces, Sybil overlap and aggressive volatility."
    case RiskSeverity.High:
      return "⚠️ High risk: multiple warning signals, including whale clustering and slippage spikes."
    case RiskSeverity.Elevated:
      return "⚡ Elevated risk: recent behavior shows irregular liquidity or token ownership."
    case RiskSeverity.Low:
      return "✅ Low risk: token activity appears stable with no significant red flags."
  }
}
