import React from 'react'
import { render, screen } from '@testing-library/react'
import { SolanaProviders } from '@/providers/solana-wallet'
import { vi } from 'vitest'

// Mock the wallet adapter components
vi.mock('@solana/wallet-adapter-react', () => ({
  ConnectionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="connection-provider">{children}</div>
  ),
  WalletProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-provider">{children}</div>
  ),
}))

vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletModalProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wallet-modal-provider">{children}</div>
  ),
}))

vi.mock('@solana/wallet-adapter-wallets', () => ({
  PhantomWalletAdapter: vi.fn(),
}))

describe('SolanaProviders', () => {
  it('renders children wrapped in wallet providers', () => {
    render(
      <SolanaProviders>
        <div data-testid="test-child">Test Content</div>
      </SolanaProviders>,
    )

    expect(screen.getByTestId('connection-provider')).toBeInTheDocument()
    expect(screen.getByTestId('wallet-provider')).toBeInTheDocument()
    expect(screen.getByTestId('wallet-modal-provider')).toBeInTheDocument()
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })
})
