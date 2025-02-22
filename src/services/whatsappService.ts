import makeWASocket, { 
  DisconnectReason, 
  useMultiFileAuthState,
  WASocket
} from '@whiskeysockets/baileys'
import { useState, useCallback } from 'react'
import { WhatsappBot, BotConfig } from '@/types/Bot'
import { supabase } from './supabaseClient'
import { CommandHandler } from './commandHandler'

export class WhatsappBotManager {
  private socket: WASocket | null = null
  private bot: WhatsappBot

  constructor(bot: WhatsappBot) {
    this.bot = bot
  }

  async initializeConnection() {
    const { state, saveCreds } = await useMultiFileAuthState(`bot-session-${this.bot.id}`)
    
    this.socket = makeWASocket({
      printQRInTerminal: true,
      auth: state,
      generateHighQualityLinkPreview: true
    })

    this.socket.ev.on('connection.update', async (update) => {
      const { connection, qr } = update
      
      if (qr) {
        await this.updateBotStatus('connecting', qr)
      }

      if (connection === 'open') {
        await this.updateBotStatus('connected')
        this.setupEventHandlers()
      }
    })
  }

  private async updateBotStatus(status: WhatsappBot['status'], qrCode?: string) {
    const { data, error } = await supabase
      .from('whatsapp_bots')
      .update({ 
        status, 
        qr_code: qrCode,
        last_active: new Date().toISOString()
      })
      .eq('id', this.bot.id)

    if (error) console.error('Failed to update bot status', error)
  }

  private setupEventHandlers() {
    if (!this.socket) return

    const commandHandler = new CommandHandler(this.socket)

    this.socket.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0]
      
      // Check if message is a command
      await commandHandler.handleCommand(message)

      // Existing message handling
      this.handleIncomingMessage(message)
    })
  }

  private async handleIncomingMessage(message: any) {
    // Basic auto-reply implementation
    if (message.message?.conversation) {
      await this.socket?.sendMessage(message.key.remoteJid!, {
        text: 'Thanks for your message! I am a bot.'
      })
    }
  }

  async disconnect() {
    this.socket?.logout()
    await this.updateBotStatus('disconnected')
  }
}

export const useBotConnection = (bot: WhatsappBot) => {
  const [botManager, setBotManager] = useState<WhatsappBotManager | null>(null)

  const initializeBot = useCallback(async () => {
    const manager = new WhatsappBotManager(bot)
    await manager.initializeConnection()
    setBotManager(manager)
  }, [bot])

  return { initializeBot, botManager }
} 