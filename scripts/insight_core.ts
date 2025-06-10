type Signal = {
    timestamp: number
    value: number
}

type PatternRecognitionResult = {
    trend: 'upward' | 'downward' | 'neutral'
    confidence: number
    volatility: number
}

class TemporalInsightEngine {
    private history: Signal[] = []

    public ingest(signal: Signal): void {
        this.history.push(signal)
        if (this.history.length > 500) {
            this.history.shift()
        }
    }

    public analyze(): PatternRecognitionResult {
        const len = this.history.length
        if (len < 3) return { trend: 'neutral', confidence: 0, volatility: 0 }

        const diffs = this.history.slice(1).map((s, i) => s.value - this.history[i].value)
        const avgChange = diffs.reduce((a, b) => a + b, 0) / diffs.length
        const volatility = Math.sqrt(diffs.reduce((acc, d) => acc + Math.pow(d - avgChange, 2), 0) / diffs.length)

        let trend: 'upward' | 'downward' | 'neutral' = 'neutral'
        if (avgChange > 0.05) trend = 'upward'
        else if (avgChange < -0.05) trend = 'downward'

        const confidence = Math.min(1, Math.abs(avgChange) * 10 / (volatility + 1))

        return { trend, confidence, volatility }
    }

    public getSnapshot(): Signal[] {
        return [...this.history]
    }

    public reset(): void {
        this.history = []
    }
}

export const insightEngine = new TemporalInsightEngine()
