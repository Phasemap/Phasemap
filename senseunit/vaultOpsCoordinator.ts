import { triggerVaultScan } from "./triggerVaultScan"
import { Connection } from "@solana/web3.js"

export class VaultOpsCoordinator {
  private connection: Connection
  private active: boolean = false

  constructor(connection: Connection) {
    this.connection = connection
  }

  async executeOps(tokenMint: string): Promise<void> {
    if (this.active) return
    this.active = true

    console.log("🚀 Starting vault operations for:", tokenMint)

    await triggerVaultScan(this.connection, {
      tokenMint,
      scanDepth: 300,
      onAlert: (msg) => console.warn("[VaultAlert]", msg)
    })

    console.log("✅ Vault operations completed.")
    this.active = false
  }
}
