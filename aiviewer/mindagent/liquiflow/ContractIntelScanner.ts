import fetch from "node-fetch"

interface ContractIntel {
  mint: string
  isRenounced: boolean
  hasBlacklist: boolean
  hasWhitelist: boolean
  tradingRestricted: boolean
  ownerAddress: string | null
  flags: string[]
}

export class ContractIntelScanner {
  constructor(private readonly rpcUrl: string) {}

  async fetchProgramData(mint: string): Promise<any> {
    const res = await fetch(`${this.rpcUrl}/contract/${mint}`)
    if (!res.ok) throw new Error(`Failed to fetch contract data`)
    return await res.json()
  }

  async analyze(mint: string): Promise<ContractIntel> {
    const data = await this.fetchProgramData(mint)

    const isRenounced = data.owner === null || data.owner === "11111111111111111111111111111111"
    const hasBlacklist = data.code?.includes("blacklist") ?? false
    const hasWhitelist = data.code?.includes("whitelist") ?? false
    const tradingRestricted = data.code?.includes("canTrade == false") ?? false
    const flags: string[] = []

    if (!isRenounced) flags.push("Ownership retained")
    if (hasBlacklist) flags.push("Blacklist logic detected")
    if (hasWhitelist) flags.push("Whitelist logic detected")
    if (tradingRestricted) flags.push("Trade lock logic")

    return {
      mint,
      isRenounced,
      hasBlacklist,
      hasWhitelist,
      tradingRestricted,
      ownerAddress: data.owner ?? null,
      flags
    }
  }
}
