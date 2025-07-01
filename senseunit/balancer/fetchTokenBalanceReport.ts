import { Connection, PublicKey } from "@solana/web3.js"

export interface TokenBalanceInfo {
  mint: string
  amount: number
  decimals: number
  uiAmount: number
  symbol?: string
}

/**
 * Fetches SPL token balance for a given wallet and mint
 */
export async function fetchTokenBalanceReport(
  connection: Connection,
  walletAddress: string,
  mintAddress: string
): Promise<TokenBalanceInfo | null> {
  const parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(walletAddress),
    { mint: new PublicKey(mintAddress) }
  )

  const tokenInfo = parsedTokenAccounts.value[0]?.account.data.parsed.info
  if (!tokenInfo) return null

  const amount = parseInt(tokenInfo.tokenAmount.amount)
  const decimals = tokenInfo.tokenAmount.decimals
  const uiAmount = parseFloat(tokenInfo.tokenAmount.uiAmount)

  return {
    mint: mintAddress,
    amount,
    decimals,
    uiAmount
  }
}
