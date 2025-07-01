import { Connection } from "@solana/web3.js"

interface ScanJob {
  token: string
  startTime: number
  status: "running" | "completed" | "failed"
}

const scanJobs: ScanJob[] = []

export function registerScanJob(token: string): void {
  scanJobs.push({
    token,
    startTime: Date.now(),
    status: "running"
  })
}

export function completeScanJob(token: string): void {
  const job = scanJobs.find(j => j.token === token && j.status === "running")
  if (job) job.status = "completed"
}

export function failScanJob(token: string): void {
  const job = scanJobs.find(j => j.token === token && j.status === "running")
  if (job) job.status = "failed"
}

export function getRunningJobs(): ScanJob[] {
  return scanJobs.filter(j => j.status === "running")
}

export function printActiveScanSummary(): void {
  const running = getRunningJobs()
  console.log(`Currently running ${running.length} scan(s):`)
  for (const job of running) {
    const elapsed = ((Date.now() - job.startTime) / 1000).toFixed(1)
    console.log(`• ${job.token} — ${elapsed}s elapsed`)
  }
}
