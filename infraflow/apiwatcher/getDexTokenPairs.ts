import axios from "axios"

export interface DexTokenPair {
  base: string
  quote: string
  volume24h: number
  liquidityUsd: number
}

export async function getDexTokenPairs(): Promise<DexTokenPair[]> {
  const res = await axios.get("https://api.dexscreener.com/latest/dex/pairs/solana")
  const pairs = res.data.pairs

  return pairs.map((p: any) => ({
    base: p.baseToken.symbol,
    quote: p.quoteToken.symbol,
    volume24h: parseFloat(p.volume.h24Usd),
    liquidityUsd: parseFloat(p.liquidity.usd)
  }))
}
