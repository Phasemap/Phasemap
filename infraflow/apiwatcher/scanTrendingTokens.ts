import axios from "axios"

export interface TrendingToken {
  symbol: string
  price: number
  change24h: number
  liquidity: number
  volume: number
}

export async function scanTrendingTokens(): Promise<TrendingToken[]> {
  const { data } = await axios.get("https://api.dexscreener.com/latest/dex/pairs/solana")
  const top = data.pairs
    .filter((p: any) => p.liquidity.usd > 5000)
    .sort((a: any, b: any) => b.volume.h24Usd - a.volume.h24Usd)
    .slice(0, 20)

  return top.map((t: any) => ({
    symbol: t.baseToken.symbol,
    price: parseFloat(t.priceUsd),
    change24h: parseFloat(t.priceChange.h24),
    liquidity: parseFloat(t.liquidity.usd),
    volume: parseFloat(t.volume.h24Usd)
  }))
}
