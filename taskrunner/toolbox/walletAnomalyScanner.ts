import { Connection, PublicKey } from "@solana/web3.js"

export interface WalletScanResult {
  address: string
  anomalyScore: number         // 0–100
  suspiciousFlags: string[]
  activityLevel: "Low" | "Medium" | "High"
}

interface ScanParams {
  connection: Connection
  walletAddresses: string[]
  maxTxCheck?: number
}

export async function scanWalletsForAnomalies({
  connection,
  walletAddresses,
  maxTxCheck = 50
}: ScanParams): Promise<WalletScanResult[]> {
  const results: WalletScanResult[] = []

  for (const addr of walletAddresses) {
    const pubkey = new PublicKey(addr)
    const txs = await connection.getConfirmedSignaturesForAddress2(pubkey, { limit: maxTxCheck })
    const sigCount = txs.length
    const suspiciousFlags: string[] = []

    let flagged = 0

    // Basic heuristics
    if (sigCount === 0) {
      suspiciousFlags.push("Dormant address")
      flagged += 10
    } else if (sigCount > 30) {
      suspiciousFlags.push("High-frequency activity")
      flagged += 20
    }

    // Slot timing analysis (mocked pattern logic)
    const burstTxs = txs.filter((tx, i) =>
      i > 0 && tx.slot - txs[i - 1].slot < 3
    )
    if (burstTxs.length >= 5) {
      suspiciousFlags.push("Burst-like slot activity")
      flagged += 25
    }

    // Vanity prefix scan
    if (/^123/.test(addr)) {
      suspiciousFlags.push("Vanity prefix pattern")
      flagged += 10
    }

    const anomalyScore = Math.min(100, flagged)
    const activityLevel = sigCount > 30 ? "High" : sigCount > 10 ? "Medium" : "Low"

    results.push({
      address: addr,
      anomalyScore,
      suspiciousFlags,
      activityLevel
    })
  }

  return results
}
