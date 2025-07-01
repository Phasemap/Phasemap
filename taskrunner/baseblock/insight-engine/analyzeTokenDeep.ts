import { Connection } from "@solana/web3.js"
import { fetchRichList, getSybilClusters } from "../core/deepFetch"

export async function analyzeTokenDeep(
  connection: Connection,
  mint: string
): Promise<{
  sybilClusters: number
  smartWallets: number
  whaleDominance: number
}> {
  const holders = await fetchRichList(connection, mint)
  const sybils = await getSybilClusters(holders)
  const smartWallets = holders.filter(h => h.txCount > 50).length
  const topHolders = holders.slice(0, 5).reduce((a, b) => a + b.balance, 0)
  const totalSupply = holders.reduce((a, b) => a + b.balance, 0)

  return {
    sybilClusters: sybils.length,
    smartWallets,
    whaleDominance: parseFloat(((topHolders / totalSupply) * 100).toFixed(2))
  }
}
