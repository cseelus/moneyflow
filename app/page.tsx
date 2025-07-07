'use client'
import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'
import { TokenBalancesTable } from '@/components/TokenBalancesTable'

export default function Home() {
  const { publicKey } = useWallet()
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4 py-8">
      <h1 className="text-3xl font-semibold">Moneyflow</h1>
      <ConnectWalletButton />
      {publicKey && (
        <>
          <p className="text-sm text-muted-foreground">Connected: {publicKey.toBase58()}</p>
          <TokenBalancesTable />
        </>
      )}
    </main>
  )
}
