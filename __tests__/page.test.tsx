import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the Moneyflow heading', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { name: 'Moneyflow' })).toBeInTheDocument()
  })

  it('renders the Get started button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: 'Get started' })).toBeInTheDocument()
  })

  it('has correct layout classes', () => {
    render(<Home />)
    const main = screen.getByRole('main')
    expect(main).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center')
  })
})
