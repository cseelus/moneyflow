import React from 'react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-3xl font-semibold mr-4">Moneyflow</h1>
      <Button>Get started</Button>
    </main>
  )
}
