type AnomalyCacheEntry = {
  token: string
  riskScore: number
  timestamp: string
}

export class AnomalyCacheStore {
  private cache: Map<string, AnomalyCacheEntry> = new Map()

  public store(token: string, score: number): void {
    this.cache.set(token, {
      token,
      riskScore: score,
      timestamp: new Date().toISOString()
    })
  }

  public get(token: string): AnomalyCacheEntry | undefined {
    return this.cache.get(token)
  }

  public recentEntries(): AnomalyCacheEntry[] {
    return Array.from(this.cache.values()).sort((a, b) =>
      b.timestamp.localeCompare(a.timestamp)
    )
  }
}
