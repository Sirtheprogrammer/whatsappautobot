import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BotConnectionPanel } from '../../components/whatsapp/BotConnectionPanel'

// Mock the WhatsApp service
jest.mock('../../services/whatsappService', () => ({
  useBotConnection: () => ({
    initializeBot: jest.fn(),
    botManager: {
      disconnect: jest.fn()
    }
  })
}))

describe('BotConnectionPanel', () => {
  const mockBot = {
    id: 'test-bot',
    userId: 'user123',
    status: 'disconnected',
    qrCode: null,
    features: {}
  }

  test('renders disconnected state initially', () => {
    render(<BotConnectionPanel bot={mockBot} />)
    
    expect(screen.getByText('Bot Disconnected')).toBeInTheDocument()
    expect(screen.getByText('Reconnect')).toBeInTheDocument()
  })

  test('shows reconnect button when disconnected', () => {
    render(<BotConnectionPanel bot={mockBot} />)
    
    const reconnectButton = screen.getByText('Reconnect')
    expect(reconnectButton).toBeInTheDocument()
  })
}) 