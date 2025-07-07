import React from 'react'
import { render, screen } from '@testing-library/react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'
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

describe('ConnectWalletButton', () => {
  it('renders the wallet connect button', () => {
    render(
      <MockWalletProvider>
        <ConnectWalletButton />
      </MockWalletProvider>,
    )

    expect(screen.getByTestId('wallet-multi-button')).toBeInTheDocument()
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })
})
