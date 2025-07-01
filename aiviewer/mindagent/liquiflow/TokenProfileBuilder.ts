import fetch from "node-fetch"

interface TokenProfile {
  symbol: string
  mint: string
  holders: number
  txCount24h: number
  volumeUSD: number
  liquidityUSD: number
  creationDate: string
  score: number
}

export class TokenProfileBuilder {
  constructor(private readonly apiBase: string) {}

  async fetchHolders(mint: string): Promise<number> {
    const res = await fetch(`${this.apiBase}/token/${mint}/holders`)
    if (!res.ok) return 0
    const data = await res.json()
    return data.count ?? 0
  }

  async fetchVolume(mint: string): Promise<{ volume: number; txCount: number }> {
    const res = await fetch(`${this.apiBase}/token/${mint}/activity`)
    if (!res.ok) return { volume: 0, txCount: 0 }
    const data = await res.json()
    return {
      volume: data.volumeUSD ?? 0,
      txCount: data.txCount24h ?? 0
    }
  }

  async fetchLiquidity(mint: string): Promise<number> {
    const res = await fetch(`${this.apiBase}/token/${mint}/liquidity`)
    if (!res.ok) return 0
    const data = await res.json()
    return data.liquidityUSD ?? 0
  }

  async fetchMetadata(mint: string): Promise<{ symbol: string; created: string }> {
    const res = await fetch(`${this.apiBase}/token/${mint}/metadata`)
    if (!res.ok) return { symbol: "UNKNOWN", created: "N/A" }
    const data = await res.json()
    return {
      symbol: data.symbol ?? "UNKNOWN",
      created: data.createdAt ?? "N/A"
    }
  }

  scoreToken(profile: TokenProfile): number {
    let score = 0
    if (profile.holders > 500) score += 1
    if (profile.volumeUSD > 10000) score += 1
    if (profile.liquidityUSD > 5000) score += 1
    if (profile.txCount24h > 300) score += 1
    return (score / 4) * 100
  }

  async build(mint: string): Promise<TokenProfile> {
    const [holders, { volume, txCount }, liquidity, { symbol, created }] =
      await Promise.all([
        this.fetchHolders(mint),
        this.fetchVolume(mint),
        this.fetchLiquidity(mint),
        this.fetchMetadata(mint)
      ])

    const profile: TokenProfile = {
      mint,
      symbol,
      holders,
      txCount24h: txCount,
      volumeUSD: volume,
      liquidityUSD: liquidity,
      creationDate: created,
      score: 0
    }

    profile.score = this.scoreToken(profile)
    return profile
  }
}
