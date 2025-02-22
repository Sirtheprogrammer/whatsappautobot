import express from 'express'
import { WhatsappBotManager } from './services/whatsappService'
import { CommandHandler } from './services/commandHandler'

export function createTestServer() {
  const app = express()
  app.use(express.json())

  // Mock WhatsApp Bot Manager
  const mockBot = {
    id: 'test-bot',
    userId: 'test-user',
    status: 'disconnected',
    features: {}
  }
  const botManager = new WhatsappBotManager(mockBot)

  // Endpoint to simulate bot connection
  app.post('/bot/connect', async (req, res) => {
    try {
      await botManager.initializeConnection()
      res.json({ status: 'connected' })
    } catch (error) {
      res.status(500).json({ error: 'Connection failed' })
    }
  })

  // Endpoint to simulate command handling
  app.post('/bot/command', async (req, res) => {
    const { message } = req.body
    
    try {
      // Mock socket for testing
      const mockSocket = {
        sendMessage: async () => {}
      } as any

      const commandHandler = new CommandHandler(mockSocket)
      
      // Simulate command handling
      await commandHandler.handleCommand({
        message: { conversation: message },
        key: { remoteJid: 'test-jid' }
      } as any)

      res.json({ status: 'command processed' })
    } catch (error) {
      res.status(500).json({ error: 'Command processing failed' })
    }
  })

  return app
} 