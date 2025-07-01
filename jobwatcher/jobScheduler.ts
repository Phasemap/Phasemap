import { Connection } from "@solana/web3.js"
import { registerScanJob, completeScanJob } from "./watchActiveScans"

interface JobSchedule {
  token: string
  intervalMs: number
  lastRun: number
}

const jobQueue: JobSchedule[] = []

export function scheduleJob(token: string, intervalMs: number): void {
  jobQueue.push({
    token,
    intervalMs,
    lastRun: 0
  })
}

export async function runJobQueue(connection: Connection): Promise<void> {
  const now = Date.now()

  for (const job of jobQueue) {
    if (now - job.lastRun >= job.intervalMs) {
      console.log(`Running scan for token ${job.token}`)
      registerScanJob(job.token)

      try {
        // Placeholder: replace with actual scan logic
        await new Promise(res => setTimeout(res, 500))
        completeScanJob(job.token)
        job.lastRun = now
      } catch (err) {
        console.warn(`Job failed for ${job.token}`, err)
      }
    }
  }
}
