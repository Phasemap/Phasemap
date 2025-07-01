import axios from "axios"

export interface DexTokenStats {
  symbol: string
  price: number
  volume24h: number
  liquidity: number
  holders?: number
}

export async function pullDexTokenStats(mintAddress: string): Promise<DexTokenStats | null> {
  const url = `https://api.dexscreener.com/latest/dex/pairs/solana/${mintAddress}`
  try {
    const res = await axios.get(url)
    const p = res.data.pair

    return {
      symbol: p.baseToken.symbol,
      price: parseFloat(p.priceUsd),
      volume24h: parseFloat(p.volume.h24Usd),
      liquidity: parseFloat(p.liquidity.usd),
    }
  } catch (e) {
    console.warn(`Failed to retrieve stats for ${mintAddress}`, e)
    return null
  }
}
