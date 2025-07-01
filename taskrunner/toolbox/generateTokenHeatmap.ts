import { Connection, PublicKey, ParsedConfirmedTransaction } from "@solana/web3.js"

export interface TimeBucket {
  hour: number
  txCount: number
  totalVolume: number
  uniqueWallets: number
}

export interface HeatmapReport {
  mint: string
  peakActivityHours: number[]
  activity: TimeBucket[]
}

export async function generateTokenHeatmap(
  connection: Connection,
  mintAddress: string,
  maxTxs: number = 1000,
  hoursBack: number = 24
): Promise<HeatmapReport> {
  const mint = new PublicKey(mintAddress)
  const now = Math.floor(Date.now() / 1000)
  const cutoff = now - hoursBack * 3600

  const signatures = await connection.getSignaturesForAddress(mint, { limit: maxTxs })
  const filtered = signatures.filter(sig => sig.blockTime && sig.blockTime > cutoff)

  const txBuckets: Map<number, { count: number, volume: number, wallets: Set<string> }> = new Map()

  for (const sig of filtered) {
    const hour = new Date(sig.blockTime! * 1000).getUTCHours()
    if (!txBuckets.has(hour)) {
      txBuckets.set(hour, { count: 0, volume: 0, wallets: new Set() })
    }

    const tx = await connection.getParsedTransaction(sig.signature, "confirmed") as ParsedConfirmedTransaction
    if (!tx) continue

    const instructions = tx.transaction.message.instructions
    const tokenTransfers = instructions.filter(i =>
      "parsed" in i &&
      i.program === "spl-token" &&
      i.parsed?.type === "transfer"
    )

    for (const transfer of tokenTransfers) {
      const info = (transfer as any).parsed.info
      const amount = parseFloat(info.amount || "0")
      const owner = info.source || "unknown"

      const bucket = txBuckets.get(hour)!
      bucket.count += 1
      bucket.volume += amount
      bucket.wallets.add(owner)
    }
  }

  const activity: TimeBucket[] = []
  for (let h = 0; h < 24; h++) {
    const b = txBuckets.get(h)
    activity.push({
      hour: h,
      txCount: b?.count || 0,
      totalVolume: parseFloat((b?.volume || 0).toFixed(2)),
      uniqueWallets: b?.wallets.size || 0
    })
  }

  const maxTx = Math.max(...activity.map(b => b.txCount))
  const peakActivityHours = activity.filter(b => b.txCount === maxTx).map(b => b.hour)

  return {
    mint: mint.toBase58(),
    peakActivityHours,
    activity
  }
}
