type Signal = {
  timestamp: number
  value: number
}

type PatternRecognitionResult = {
  trend: 'upward' | 'downward' | 'neutral'
  confidence: number
  volatility: number
}

type AnalyzeOptions = {
  /** Use only the most recent N points (default: min(history, 128)) */
  window?: number
  /**
   * Base threshold for declaring up/down (per-step change).
   * Effective threshold is max(thresholdBase, 0.5 * volatility). Default: 0.05
   */
  thresholdBase?: number
}

export class TemporalInsightEngine {
  private history: Signal[] = []
  private maxHistory: number

  constructor(opts: { maxHistory?: number } = {}) {
    this.maxHistory = Math.max(8, opts.maxHistory ?? 500)
  }

  /** Append one signal (finite numbers only). Keeps most recent `maxHistory`. */
  public ingest(signal: Signal): void {
    this.assertFinite(signal.timestamp, 'timestamp')
    this.assertFinite(signal.value, 'value')
    this.history.push(signal)
    if (this.history.length > this.maxHistory) {
      this.history.splice(0, this.history.length - this.maxHistory)
    }
  }

  /** Bulk-ingest signals (sorted by timestamp for deterministic analysis). */
  public ingestBatch(signals: Signal[]): void {
    for (const s of signals) this.ingest(s)
  }

  /** Adjust history cap (keeps only the newest entries if downsizing). */
  public setMaxHistory(n: number): void {
    if (!Number.isInteger(n) || n < 8) throw new Error('maxHistory must be an integer ≥ 8')
    this.maxHistory = n
    if (this.history.length > n) {
      this.history.splice(0, this.history.length - n)
    }
  }

  /**
   * Analyze recent history and return trend, confidence, and volatility.
   * - Trend is based on the regression slope over the last `window` points.
   * - Volatility is the population stddev of first differences.
   * - Confidence scales with |slope| relative to volatility (clamped 0..1).
   */
  public analyze(options: AnalyzeOptions = {}): PatternRecognitionResult {
    const len = this.history.length
    if (len < 3) return { trend: 'neutral', confidence: 0, volatility: 0 }

    const window = Math.max(3, Math.min(options.window ?? Math.min(len, 128), len))
    // Work on the last `window` points, sorted by timestamp (stable if equal)
    const tail = this.history.slice(-window).slice().sort((a, b) => a.timestamp - b.timestamp)

    // First differences (per step)
    const diffs: number[] = []
    for (let i = 1; i < tail.length; i++) {
      diffs.push(tail[i].value - tail[i - 1].value)
    }

    // Volatility = population stddev of diffs
    const meanDiff = avg(diffs)
    const volatility = Math.sqrt(avg(diffs.map((d) => (d - meanDiff) ** 2)))

    // Trend via simple linear regression of value ~ index (time-agnostic step)
    // x: 0..n-1, y: values
    const y = tail.map((p) => p.value)
    const slope = linearSlopeFromIndex(y) // per step average change (like meanDiff but more robust)

    // Threshold combines base and volatility to avoid overreacting in noisy series
    const thresholdBase = options.thresholdBase ?? 0.05
    const eps = Math.max(thresholdBase, 0.5 * volatility)

    let trend: 'upward' | 'downward' | 'neutral' = 'neutral'
    if (slope > eps) trend = 'upward'
    else if (slope < -eps) trend = 'downward'

    // Confidence: scale of |slope| relative to volatility, saturating to 1
    // confRaw = |slope| / (volatility + 1e-9); map via conf = confRaw / (1 + confRaw)
    const confRaw = Math.abs(slope) / (volatility + 1e-9)
    const confidence = clamp(confRaw / (1 + confRaw), 0, 1)

    return {
      trend,
      confidence: round(confidence, 3),
      volatility: round(volatility, 6),
    }
  }

  /** Read-only snapshot of history (new array). */
  public getSnapshot(): Signal[] {
    return this.history.slice()
  }

  /** Clear all history. */
  public reset(): void {
    this.history = []
  }

  // ---------- helpers ----------
  private assertFinite(x: unknown, name: string): void {
    if (typeof x !== 'number' || !Number.isFinite(x)) {
      throw new TypeError(`${name} must be a finite number`)
    }
  }
}

export const insightEngine = new TemporalInsightEngine()

// ================= utils =================
function avg(arr: number[]): number {
  if (arr.length === 0) return 0
  let s = 0
  for (let i = 0; i < arr.length; i++) s += arr[i]
  return s / arr.length
}

function linearSlopeFromIndex(y: number[]): number {
  const n = y.length
  if (n < 2) return 0
  // x = 0..n-1
  const xMean = (n - 1) / 2
  const yMean = avg(y)
  let num = 0
  let den = 0
  for (let i = 0; i < n; i++) {
    const dx = i - xMean
    num += dx * (y[i] - yMean)
    den += dx * dx
  }
  return den === 0 ? 0 : num / den
}

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x))
}

function round(x: number, digits: number): number {
  const p = Math.pow(10, digits)
  return Math.round(x * p) / p
}
