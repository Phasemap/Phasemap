import { PublicKey, Connection } from "@solana/web3.js"

export async function analyzeToken(
  connection: Connection,
  tokenMint: string
): Promise<Record<string, any>> {
  const mint = new PublicKey(tokenMint)
  const tokenAccounts = await connection.getTokenLargestAccounts(mint)
  const holders = tokenAccounts.value.length

  const supplyInfo = await connection.getParsedAccountInfo(mint)
  const decimals = supplyInfo.value?.data?.parsed?.info?.decimals ?? 0

  return {
    mint: tokenMint,
    topHolders: holders,
    decimals
  }
}
