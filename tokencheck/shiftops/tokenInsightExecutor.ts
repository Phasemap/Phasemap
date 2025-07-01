import { Connection, PublicKey } from "@solana/web3.js"
import { TokenInsight } from "./tokenInsightSchema"

export async function getTokenInsight(
  conn: Connection,
  mintAddress: string
): Promise<TokenInsight> {
  const mint = new PublicKey(mintAddress)

  // Simulated metrics
  const liquidity = Math.random() * 100000
  const volume24h = Math.random() * 50000
  const txCount = Math.floor(Math.random() * 200)
  const flagged = volume24h < 1000 && liquidity < 1000

  return {
    mint: mint.toBase58(),
    liquidity,
    volume24h,
    txCount,
    flagged
  }
}