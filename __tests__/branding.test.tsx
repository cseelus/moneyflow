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

describe('Branding Elements', () => {
  it('renders the Moneyflow logo next to the heading', () => {
    render(
      <MockWalletProvider>
        <Home />
      </MockWalletProvider>,
    )

    // Check that the heading is present
    const heading = screen.getByRole('heading', { name: 'Moneyflow' })
    expect(heading).toBeInTheDocument()

    // Check that the logo is present
    const logo = screen.getByAltText('Moneyflow Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/moneyflow-logo.svg')

    // Check that they are in a container together
    const container = heading.parentElement
    expect(container).toHaveClass('flex', 'items-center', 'gap-3')
    expect(container).toContainElement(logo)
  })

  // Note: We can't directly test the page title and favicon in this component test
  // as they are set in the layout.tsx file which is not rendered in this test.
  // A proper end-to-end test would be needed for that.
})
