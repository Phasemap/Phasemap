interface TxBurst {
  token: string
  timestamps: number[]
}

/**
 * Detect tokens with bursts of transactions.
 *
 * @param data       Array of TxBurst entries (token + timestamps)
 * @param windowMs   Time window in ms to consider a burst (default 5 min)
 * @param threshold  Minimum number of events within window to flag (default 10)
 * @returns Array of token symbols that exceeded the threshold
 */
export function detectBursts(
  data: TxBurst[],
  windowMs = 300_000,
  threshold = 10
): string[] {
  const flagged = new Set<string>()

  for (const { token, timestamps } of data) {
    if (!Array.isArray(timestamps) || timestamps.length < threshold) {
      continue
    }

    // clone + sort so original isn't mutated
    const sorted = [...timestamps].sort((a, b) => a - b)
    let left = 0

    // sliding window: expand right pointer, shrink left to maintain windowMs
    for (let right = 0; right < sorted.length; right++) {
      while (sorted[right] - sorted[left] > windowMs) {
        left++
      }
      const count = right - left + 1
      if (count >= threshold) {
        flagged.add(token)
        break
      }
    }
  }

  return Array.from(flagged)
}
