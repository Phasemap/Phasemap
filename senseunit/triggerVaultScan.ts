import { Connection, PublicKey, ConfirmedSignatureInfo } from "@solana/web3.js"

export interface VaultScanConfig {
  tokenMint: string                      // Target token mint
  scanDepth: number                     // Max number of transactions to analyze
  onAlert?: (msg: string, meta?: any) => void // Optional hook for alerting/logging
  verbose?: boolean                     // Enable additional debug messages
}

export interface VaultScanStats {
  total: number
  failed: number
  pending: number
  finalized: number
}

/**
 * Triggers a scan of recent transactions involving a given mint address.
 * It reports failures, pending transactions, and summary stats via callback.
 */
export async function triggerVaultScan(
  connection: Connection,
  config: VaultScanConfig
): Promise<void> {
  const { tokenMint, scanDepth, onAlert, verbose = false } = config

  if (!tokenMint || typeof tokenMint !== "string") {
    throw new Error("Invalid or missing tokenMint")
  }
  if (!Number.isInteger(scanDepth) || scanDepth < 1 || scanDepth > 1000) {
    throw new Error("scanDepth must be a positive integer (1–1000)")
  }

  const mint = new PublicKey(tokenMint)
  let stats: VaultScanStats = {
    total: 0,
    failed: 0,
    pending: 0,
    finalized: 0
  }

  let signatures: ConfirmedSignatureInfo[] = []

  try {
    signatures = await connection.getSignaturesForAddress(mint, { limit: scanDepth })
    stats.total = signatures.length

    for (const sig of signatures) {
      if (sig.err) {
        stats.failed++
        onAlert?.(`⚠️ Failed transaction: ${sig.signature}`, { reason: sig.err })
      } else if (sig.confirmationStatus !== "finalized") {
        stats.pending++
        onAlert?.(`⏳ Pending transaction: ${sig.signature}`, { status: sig.confirmationStatus })
      } else {
        stats.finalized++
        if (verbose) {
          onAlert?.(`✅ Finalized transaction: ${sig.signature}`)
        }
      }
    }

    onAlert?.(
      `📊 Vault scan complete: ${stats.total} scanned | ✅ ${stats.finalized} | ⏳ ${stats.pending} | ❌ ${stats.failed}`,
      stats
    )
  } catch (err: any) {
    onAlert?.(`❌ Vault scan failed: ${err.message || err}`, { error: err })
    throw err
  }
}
