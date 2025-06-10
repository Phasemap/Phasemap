
class AIMetricEngine {
  constructor() {
    this.dataset = [];
    this.weights = {};
    this.anomalyScores = [];
    this.statusFlags = [];
  }

  ingest(dataPoint, tag = 'default') {
    if (typeof dataPoint === 'number') {
      this.dataset.push({ value: dataPoint, tag });
    }
  }

  tagWeights(config) {
    this.weights = { ...config };
  }

  weightedValues() {
    return this.dataset.map(entry => {
      const weight = this.weights[entry.tag] || 1;
      return entry.value * weight;
    });
  }

  zScoreTransform() {
    const values = this.weightedValues();
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const std = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
    this.dataset = this.dataset.map((entry, i) => ({
      ...entry,
      value: (values[i] - mean) / (std || 1)
    }));
  }

  generateAnomalyScores(sensitivity = 2.0) {
    this.anomalyScores = this.dataset.map(entry => Math.abs(entry.value) > sensitivity ? 1 : 0);
  }

  trendSlope(window = 5) {
    if (this.dataset.length < window) return 0;
    const values = this.dataset.slice(-window).map(d => d.value);
    const sumX = values.reduce((_, __, i) => i + 1, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((a, b, i) => a + b * (i + 1), 0);
    const sumX2 = values.reduce((a, _, i) => a + (i + 1) ** 2, 0);
    const n = values.length;
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX ** 2);
  }

  autoFlag() {
    this.statusFlags = this.anomalyScores.map(score => score ? '⚠️ Anomaly' : '✅ Normal');
  }

  summarizeBatch() {
    return {
      entries: this.dataset.length,
      anomalies: this.anomalyScores.filter(x => x === 1).length,
      trend: this.trendSlope()
    };
  }

  reduceNoise(alpha = 0.1) {
    if (!this.dataset.length) return;
    let smoothed = this.dataset[0].value;
    this.dataset = this.dataset.map((entry, i) => {
      if (i === 0) return { ...entry, value: smoothed };
      smoothed = alpha * entry.value + (1 - alpha) * smoothed;
      return { ...entry, value: smoothed };
    });
  }

  findDivergences() {
    const diffs = [];
    for (let i = 1; i < this.dataset.length; i++) {
      const delta = Math.abs(this.dataset[i].value - this.dataset[i - 1].value);
      if (delta > 1.0) diffs.push({ index: i, delta });
    }
    return diffs;
  }

  exportData() {
    return JSON.stringify(this.dataset, null, 2);
  }

  importData(json) {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed)) {
        this.dataset = parsed.filter(p => typeof p.value === 'number' && typeof p.tag === 'string');
      }
    } catch (err) {
      console.error('Invalid JSON format');
    }
  }

  resetEngine() {
    this.dataset = [];
    this.anomalyScores = [];
    this.statusFlags = [];
  }
}

module.exports = AIMetricEngine;
