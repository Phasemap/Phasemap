interface TokenEvent {
  token: string
  wallet: string
  volume: number
}

export function groupByToken(events: TokenEvent[]): Map<string, TokenEvent[]> {
  const map = new Map<string, TokenEvent[]>()
  for (const evt of events) {
    if (!map.has(evt.token)) map.set(evt.token, [])
    map.get(evt.token)!.push(evt)
  }
  return map
}

export function summarizeTokenClusters(events: TokenEvent[]): Record<string, number> {
  const groups = groupByToken(events)
  const summary: Record<string, number> = {}
  for (const [token, group] of groups.entries()) {
    summary[token] = group.reduce((acc, e) => acc + e.volume, 0)
  }
  return summary
}
