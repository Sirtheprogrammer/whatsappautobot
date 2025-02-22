export interface WhatsappBot {
  id?: string
  userId: string
  status: 'disconnected' | 'connecting' | 'connected'
  qrCode?: string
  lastActive?: Date
  webhookUrl?: string
  features: {
    aiEnabled?: boolean
    economyEnabled?: boolean
    gameMode?: boolean
    privacySettings?: {
      allowGroupInvites?: boolean
      adminOnly?: boolean
    }
  }
}

export interface BotConfig {
  autoReply?: boolean
  welcomeMessage?: string
  supportedCommands?: string[]
} 