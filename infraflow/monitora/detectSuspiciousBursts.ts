interface TxBurst {
  token: string
  timestamps: number[]
}

export function detectBursts(data: TxBurst[], windowMs = 300_000, threshold = 10): string[] {
  const flagged: string[] = []

  for (const entry of data) {
    const sorted = entry.timestamps.sort()
    let burstCount = 0
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] <= windowMs) burstCount++
    }

    if (burstCount >= threshold) {
      flagged.push(entry.token)
    }
  }

  return flagged
}
