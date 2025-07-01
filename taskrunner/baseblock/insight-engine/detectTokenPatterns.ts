import { Connection } from "@solana/web3.js"
import { detectFlashloanSpikes, detectPumpDumpShape } from "../patterns"

export async function detectTokenPatterns(
  connection: Connection,
  mint: string
): Promise<string[]> {
  const anomalies: string[] = []

  const flashloan = await detectFlashloanSpikes(connection, mint)
  if (flashloan) anomalies.push("Flashloan Spike Detected")

  const pumpDump = await detectPumpDumpShape(connection, mint)
  if (pumpDump) anomalies.push("Pump & Dump Pattern")

  return anomalies.length > 0 ? anomalies : ["No anomaly patterns found"]
}
