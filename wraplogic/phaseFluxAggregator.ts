export interface PhaseFlowPoint {
  timestamp: number
  inVolume: number
  outVolume: number
}

export function aggregatePhaseFlow(data: PhaseFlowPoint[]): {
  net: number
  averageRate: number
  inverted: boolean
} {
  if (!data.length) return { net: 0, averageRate: 0, inverted: false }

  const net = data.reduce((sum, d) => sum + (d.inVolume - d.outVolume), 0)
  const averageRate = net / data.length

  return {
    net,
    averageRate: parseFloat(averageRate.toFixed(2)),
    inverted: net < 0
  }
}