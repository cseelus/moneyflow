import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { TokenBalancesTable } from '@/components/TokenBalancesTable'
import { useWallet } from '@solana/wallet-adapter-react'
import { getTokenBalances } from '@/services/token-service'
import { PublicKey } from '@solana/web3.js'
import { vi, describe, test, expect, beforeEach } from 'vitest'

// Mock the useWallet hook
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: vi.fn(),
}))

// Mock the token service
vi.mock('@/services/token-service', () => ({
  getTokenBalances: vi.fn(),
}))

describe('TokenBalancesTable', () => {
  const mockPublicKey = {
    toBase58: vi.fn().mockReturnValue('testWalletAddress'),
  } as unknown as PublicKey

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders nothing when wallet is not connected', () => {
    // Mock wallet not connected
    ;(useWallet as any).mockReturnValue({
      publicKey: null,
    })

    render(<TokenBalancesTable />)

    // Component should not render anything
    expect(screen.queryByText('Token Balances')).not.toBeInTheDocument()
  })

  test('renders loading state while fetching token balances', async () => {
    // Mock wallet connected
    ;(useWallet as any).mockReturnValue({
      publicKey: mockPublicKey,
    })

    // Mock token service to delay response
    ;(getTokenBalances as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100)),
    )

    render(<TokenBalancesTable />)

    // Should show loading state
    expect(screen.getByText('Loading token balances...')).toBeInTheDocument()
  })

  test('renders empty state when no tokens are found', async () => {
    // Mock wallet connected
    ;(useWallet as any).mockReturnValue({
      publicKey: mockPublicKey,
    })

    // Mock token service to return empty array
    ;(getTokenBalances as any).mockResolvedValue([])

    render(<TokenBalancesTable />)

    await waitFor(() => {
      expect(screen.getByText('No tokens found in this wallet.')).toBeInTheDocument()
    })
  })

  test('renders token balances table with data', async () => {
    // Mock wallet connected
    ;(useWallet as any).mockReturnValue({
      publicKey: mockPublicKey,
    })

    // Mock token service to return sample data
    const mockTokens = [
      {
        name: 'Solana',
        symbol: 'SOL',
        amount: 1.5,
        decimals: 9,
        valuePerToken: 150.0,
        totalValue: 225.0,
        logoURI: 'https://example.com/sol.png',
      },
      {
        name: 'USD Coin',
        symbol: 'USDC',
        amount: 100,
        decimals: 6,
        valuePerToken: 1.0,
        totalValue: 100.0,
        logoURI: 'https://example.com/usdc.png',
      },
    ]

    ;(getTokenBalances as any).mockResolvedValue(mockTokens)

    render(<TokenBalancesTable />)

    await waitFor(() => {
      // Check table headers
      expect(screen.getByText('Token name')).toBeInTheDocument()
      expect(screen.getByText('Token value')).toBeInTheDocument()
      expect(screen.getByText('Token amount')).toBeInTheDocument()
      expect(screen.getByText('Total value (USD)')).toBeInTheDocument()

      // Check token data
      expect(screen.getByText(/Solana \(SOL\)/)).toBeInTheDocument()
      expect(screen.getByText(/USD Coin \(USDC\)/)).toBeInTheDocument()
    })
  })

  test('handles errors when fetching token balances', async () => {
    // Mock wallet connected
    ;(useWallet as any).mockReturnValue({
      publicKey: mockPublicKey,
    })

    // Mock token service to throw an error
    ;(getTokenBalances as any).mockRejectedValue(new Error('API error'))

    render(<TokenBalancesTable />)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to fetch token balances. Please try again.'),
      ).toBeInTheDocument()
    })
  })
})
