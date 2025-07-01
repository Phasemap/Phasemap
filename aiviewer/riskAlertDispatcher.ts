export class RiskAlertDispatcher {
  constructor(private readonly webhookUrl: string) {}

  async dispatchAlert(message: string, level: "low" | "elevated" | "critical"): Promise<void> {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message
    }

    await fetch(this.webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
  }
}
