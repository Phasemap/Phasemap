import { Connection, PublicKey } from "@solana/web3.js"

interface ActivityStats {
  totalTxs: number
  hourlyDistribution: Record<number, number>
  firstSeen: string
  lastSeen: string
}

export async function analyzeTokenActivity(
  connection: Connection,
  mint: string
): Promise<ActivityStats> {
  const address = new PublicKey(mint)
  const signatures = await connection.getSignaturesForAddress(address, { limit: 1000 })

  const hourlyMap: Record<number, number> = {}
  let firstSeen = Date.now()
  let lastSeen = 0

  for (const sig of signatures) {
    if (!sig.blockTime) continue
    const ts = sig.blockTime * 1000
    const hour = new Date(ts).getUTCHours()
    hourlyMap[hour] = (hourlyMap[hour] || 0) + 1
    if (ts < firstSeen) firstSeen = ts
    if (ts > lastSeen) lastSeen = ts
  }

  return {
    totalTxs: signatures.length,
    hourlyDistribution: hourlyMap,
    firstSeen: new Date(firstSeen).toISOString(),
    lastSeen: new Date(lastSeen).toISOString()
  }
}
