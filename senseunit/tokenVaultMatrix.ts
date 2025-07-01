export const coreVaultModules: Record<string, string[]> = {
  liquidity: ["balanceTracker", "transferMonitor", "stressAnalyzer"],
  activity: ["txHeatmap", "volumeAnomaly", "signalSurgeDetector"],
  risk: ["sybilClustering", "flashloanMonitor", "whaleIndexTracker"]
}

/**
 * Returns modules related to a given domain
 */
export function getVaultModulesByDomain(domain: string): string[] {
  return coreVaultModules[domain] || []
}

/**
 * Returns all available modules across domains
 */
export function listAllVaultModules(): string[] {
  return Object.values(coreVaultModules).flat()
}
