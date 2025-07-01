import React from "react"

export const WalletSignalGrid = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white dark:bg-gray-900">
      <h2 className="text-xl font-bold mb-2">Wallet Signals</h2>
      <p className="text-sm text-gray-500">Wallets with recent phase triggers</p>
      <table className="w-full mt-3 text-sm">
        <thead><tr><th>Wallet</th><th>Signal</th></tr></thead>
        <tbody>
          <tr><td>abc123...xyz</td><td>Spike Detected</td></tr>
          <tr><td>def456...uvw</td><td>Flash Volume</td></tr>
        </tbody>
      </table>
    </div>
  )
}