import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { ConnectionProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { vi } from 'vitest'

// Mock the wallet adapter components
vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: ({ children, ...props }: any) => (
    <button data-testid="wallet-multi-button" {...props}>
      {children || 'Connect Wallet'}
    </button>
  ),
}))

const MockWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const endpoint = clusterApiUrl('devnet')
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect={false}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}

describe('Home Page', () => {
  it('renders the Moneyflow heading', () => {
    render(
      <MockWalletProvider>
        <Home />
      </MockWalletProvider>,
    )
    expect(screen.getByRole('heading', { name: 'Moneyflow' })).toBeInTheDocument()
  })

  it('renders the Connect Wallet button', () => {
    render(
      <MockWalletProvider>
        <Home />
      </MockWalletProvider>,
    )
    expect(screen.getByTestId('wallet-multi-button')).toBeInTheDocument()
  })

  it('has correct layout classes', () => {
    render(
      <MockWalletProvider>
        <Home />
      </MockWalletProvider>,
    )
    const main = screen.getByRole('main')
    expect(main).toHaveClass(
      'flex',
      'min-h-screen',
      'items-center',
      'justify-center',
      'flex-col',
      'gap-4',
    )
  })

  it('does not show connected wallet info when no wallet is connected', () => {
    render(
      <MockWalletProvider>
        <Home />
      </MockWalletProvider>,
    )
    expect(screen.queryByText(/Connected:/)).not.toBeInTheDocument()
  })
})
