export class TokenSignalAgent {
  private lastScan: number = 0
  private readonly interval: number

  constructor(scanInterval: number = 300_000) {
    this.interval = scanInterval
  }

  public shouldTriggerScan(): boolean {
    const now = Date.now()
    return now - this.lastScan >= this.interval
  }

  public updateLastScan(): void {
    this.lastScan = Date.now()
  }

  public report(): string {
    return `Token signal agent last scan at ${new Date(this.lastScan).toISOString()}`
  }
}
