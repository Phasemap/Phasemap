import { PublicKey } from "@solana/web3.js"

export function classifyTokenRisk({
  mint,
  creatorCount,
  txFrequency,
  flaggedReports
}: {
  mint: PublicKey
  creatorCount: number
  txFrequency: number
  flaggedReports: number
}): string {
  if (flaggedReports > 5 || creatorCount > 3) return "high"
  if (txFrequency < 10) return "medium"
  return "low"
}