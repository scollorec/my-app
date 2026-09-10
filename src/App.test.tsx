import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('NOVA webinar agenda', () => {
  it('updates the focused session and saves it to the schedule', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /from pilot to product/i }))
    expect(screen.getByRole('heading', { name: 'From pilot to product' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /add to my schedule/i }))
    expect(screen.getByRole('button', { name: /saved to your schedule/i })).toBeInTheDocument()
  })
})
