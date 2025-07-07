'use client'
import React, { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getTokenBalances, Token } from '@/services/token-service'

export const TokenBalancesTable: React.FC = () => {
  const { publicKey } = useWallet()
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokenBalances() {
      if (!publicKey) {
        setTokens([])
        return
      }

      setLoading(true)
      setError(null)

      try {
        const walletAddress = publicKey.toBase58()
        const tokenBalances = await getTokenBalances(walletAddress)
        setTokens(tokenBalances)
      } catch (err) {
        console.error('Error fetching token balances:', err)
        setError('Failed to fetch token balances. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTokenBalances()
  }, [publicKey])

  if (!publicKey) {
    return null
  }

  if (loading) {
    return (
      <div className="w-full max-w-3xl mt-8">
        <div className="text-center py-4">Loading token balances...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl mt-8">
        <div className="text-red-500 py-4">{error}</div>
      </div>
    )
  }

  if (tokens.length === 0) {
    return (
      <div className="w-full max-w-3xl mt-8">
        <div className="text-center py-4">No tokens found in this wallet.</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mt-8">
      <h2 className="text-xl font-semibold mb-4">Token Balances</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 text-left">Token name</th>
              <th className="py-3 px-4 text-right">Token value</th>
              <th className="py-3 px-4 text-right">Token amount</th>
              <th className="py-3 px-4 text-right">Total value (USD)</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-3 px-4 flex items-center">
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="w-5 h-5 mr-2 rounded-full"
                      onError={(e) => {
                        // Hide broken images
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                  <span>
                    {token.name} ({token.symbol})
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  ${token.valuePerToken.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  {token.amount.toLocaleString(undefined, {
                    maximumFractionDigits: 6,
                  })}
                </td>
                <td className="py-3 px-4 text-right">
                  ${token.totalValue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}