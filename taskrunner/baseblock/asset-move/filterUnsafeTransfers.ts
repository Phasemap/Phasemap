import { PublicKey } from "@solana/web3.js"

export interface TransferPayload {
  source: string
  destination: string
  amount: number
  mint: string
  timestamp: number
  memo?: string
}

export interface TransferFilterResult {
  isBlocked: boolean
  reason?: string
}

/**
 * Blacklist of known suspicious addresses
 */
const blockedAddresses: Set<string> = new Set([
  "4Nd1mEtUv...",  // example malicious wallet
  "B3GhZt5x..."
])

/**
 * Filters a transfer payload for known risk signals
 */
export function filterUnsafeTransfers(payload: TransferPayload): TransferFilterResult {
  const { source, destination, amount, mint, memo } = payload

  if (!PublicKey.isOnCurve(source) || !PublicKey.isOnCurve(destination)) {
    return { isBlocked: true, reason: "Invalid address curve" }
  }

  if (blockedAddresses.has(source) || blockedAddresses.has(destination)) {
    return { isBlocked: true, reason: "Blacklisted wallet detected" }
  }

  if (amount <= 0 || !Number.isFinite(amount)) {
    return { isBlocked: true, reason: "Invalid or zero amount" }
  }

  if (mint.length !== 44) {
    return { isBlocked: true, reason: "Invalid mint address format" }
  }

  if (memo && memo.toLowerCase().includes("airdrop")) {
    return { isBlocked: true, reason: "Suspicious memo pattern" }
  }

  return { isBlocked: false }
}
