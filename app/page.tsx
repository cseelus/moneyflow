'use client'
import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { ConnectWalletButton } from '@/components/ConnectWalletButton'
import Image from 'next/image'

export default function Home() {
  const { publicKey } = useWallet()
  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">
      <div className="flex items-center gap-3">
        <Image src="/moneyflow-logo.svg" alt="Moneyflow Logo" width={40} height={24} priority />
        <h1 className="text-3xl font-semibold">Moneyflow</h1>
      </div>
      <ConnectWalletButton />
      {publicKey && (
        <p className="text-sm text-muted-foreground">Connected: {publicKey.toBase58()}</p>
      )}
    </main>
  )
}
