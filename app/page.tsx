'use client'
import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'

export default function Home() {
  const { publicKey } = useWallet()
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <div className="flex items-center gap-3">
        <img src="/moneyflow-logo.svg" alt="Moneyflow Logo" className="h-10 w-auto" />
        <h1 className="text-3xl font-semibold">Moneyflow</h1>
      </div>
      <ConnectWalletButton />
      {publicKey && (
        <p className="text-sm text-muted-foreground">Connected: {publicKey.toBase58()}</p>
      )}
    </main>
  )
}
