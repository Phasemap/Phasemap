import { Connection, PublicKey } from "@solana/web3.js"

export interface VaultScanConfig {
  tokenMint: string
  scanDepth: number
  onAlert?: (msg: string) => void
}

/**
 * Simulates a vault-level scan for a given token on Solana
 */
export async function triggerVaultScan(
  connection: Connection,
  config: VaultScanConfig
): Promise<void> {
  const mint = new PublicKey(config.tokenMint)
  const signatures = await connection.getSignaturesForAddress(mint, { limit: config.scanDepth })

  for (const sig of signatures) {
    if (sig.err) {
      config.onAlert?.(`Failed transaction: ${sig.signature}`)
    } else if (sig.confirmationStatus !== "finalized") {
      config.onAlert?.(`Pending transaction: ${sig.signature}`)
    }
  }

  config.onAlert?.(`Vault scan complete: ${signatures.length} entries scanned.`)
}
