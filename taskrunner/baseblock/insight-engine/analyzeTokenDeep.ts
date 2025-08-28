import { Connection } from "@solana/web3.js"
import { fetchRichList, getSybilClusters } from "../core/deepFetch"

type Holder = {
  address: string
  balance: number
  txCount: number
}

export type AnalyzeTokenDeepResult = {
  sybilClusters: number
  smartWallets: number
  whaleDominance: number // %
}

export interface AnalyzeTokenDeepOptions {
  /** Top-N holders for dominance calc (default: 5) */
  topN?: number
  /** tx count threshold to consider a wallet "smart" (default: 50) */
  smartWalletTxThreshold?: number
  /** Ignore holders with balance <= this value (default: 0) */
  minBalanceFilter?: number
}

/**
 * Analyze rich-list properties of a token in a deterministic, robust way.
 * - Ensures finiteness of numeric fields
 * - Sorts holders by balance (desc) prior to Top-N dominance
 * - Guards against divide-by-zero on empty/zero supply
 */
export async function analyzeTokenDeep(
  connection: Connection,
  mint: string,
  opts: AnalyzeTokenDeepOptions = {}
): Promise<AnalyzeTokenDeepResult> {
  const {
    topN = 5,
    smartWalletTxThreshold = 50,
    minBalanceFilter = 0,
  } = opts

  if (!mint || typeof mint !== "string") {
    throw new Error("mint must be a non-empty string")
  }

  // 1) Fetch holders (rich list)
  let holdersRaw: Holder[]
  try {
    holdersRaw = await fetchRichList(connection, mint)
  } catch (e: any) {
    throw new Error(`fetchRichList failed: ${e?.message || String(e)}`)
  }

  // 2) Sanitize and filter
  const holders: Holder[] = []
  for (const h of holdersRaw as Holder[]) {
    const bal = toFiniteNumber((h as any).balance)
    const txc = toFiniteNumber((h as any).txCount)
    if (bal > minBalanceFilter) {
      holders.push({
        address: String((h as any).address ?? ""),
        balance: bal,
        txCount: Math.max(0, Math.floor(txc)),
      })
    }
  }

  // 3) Sybil clusters (based on sanitized list)
  let sybils: unknown[]
  try {
    sybils = await getSybilClusters(holders as any)
  } catch (e: any) {
    throw new Error(`getSybilClusters failed: ${e?.message || String(e)}`)
  }

  // 4) Smart wallets
  const smartWallets = holders.filter((h) => h.txCount > smartWalletTxThreshold).length

  // 5) Whale dominance (% of supply held by top-N)
  const sorted = [...holders].sort((a, b) => b.balance - a.balance)
  const topSupply = sum(sorted.slice(0, Math.max(1, topN)).map((h) => h.balance))
  const totalSupply = sum(sorted.map((h) => h.balance))
  const whaleDominance =
    totalSupply > 0 ? round((topSupply / totalSupply) * 100, 2) : 0

  return {
    sybilClusters: Array.isArray(sybils) ? sybils.length : 0,
    smartWallets,
    whaleDominance,
  }
}

/* ------------------------ helpers ------------------------ */

function toFiniteNumber(x: unknown): number {
  const n = Number(x)
  return Number.isFinite(n) ? n : 0
}

function sum(arr: number[]): number {
  let s = 0
  for (let i = 0; i < arr.length; i++) s += arr[i]
  return s
}

function round(x: number, digits: number): number {
  const p = Math.pow(10, digits)
  return Math.round(x * p) / p
}
