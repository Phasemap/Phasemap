import { fetchTokenInfo } from "@/api/phasemap/tokenRegistry"

export interface GenesisTokenData {
  mint: string
  createdAt: number
  creator: string
  firstHourTxs: number
  earlyHolders: number
}

export async function watchTokenGenesis(mint: string): Promise<GenesisTokenData> {
  const meta = await fetchTokenInfo(mint)
  const oneHourLater = meta.createdAt + 3600_000

  return {
    mint,
    createdAt: meta.createdAt,
    creator: meta.creator,
    firstHourTxs: await countTxsDuringGenesis(mint, meta.createdAt, oneHourLater),
    earlyHolders: await countGenesisHolders(mint, meta.createdAt, oneHourLater)
  }
}

async function countTxsDuringGenesis(mint: string, start: number, end: number): Promise<number> {
  const res = await fetch(`/api/token/${mint}/txs?start=${start}&end=${end}`)
  const json = await res.json()
  return json.total || 0
}

async function countGenesisHolders(mint: string, start: number, end: number): Promise<number> {
  const res = await fetch(`/api/token/${mint}/holders?start=${start}&end=${end}`)
  const json = await res.json()
  return json.unique || 0
}