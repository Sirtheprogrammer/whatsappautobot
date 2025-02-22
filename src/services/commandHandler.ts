import { WASocket, proto } from '@whiskeysockets/baileys'
import { GeminiAIService } from './aiService'

export class CommandHandler {
  private socket: WASocket
  private aiService: GeminiAIService
  private commands: Record<string, (message: proto.IWebMessageInfo) => Promise<void>> = {}

  constructor(socket: WASocket) {
    this.socket = socket
    this.aiService = new GeminiAIService()
    this.registerCommands()
  }

  private registerCommands() {
    // Menu Commands
    this.commands['allmenu'] = this.handleAllMenu
    this.commands['aimenu'] = this.handleAIMenu
    this.commands['animemenu'] = this.handleAnimeMenu
    this.commands['botmenu'] = this.handleBotMenu

    // Functional Commands
    this.commands['autoreact'] = this.handleAutoReact
    this.commands['enable'] = this.handleEnable
    this.commands['fancy'] = this.handleFancy

    // Media Commands
    this.commands['imagen'] = this.handleImageGeneration
    this.commands['randompic'] = this.handleRandomPic
    this.commands['randomvid'] = this.handleRandomVideo

    // Utility Commands
    this.commands['toolsmenu'] = this.handleToolsMenu
    this.commands['setprivacy'] = this.handleSetPrivacy

    // Add new AI commands
    this.commands['chatgpt'] = this.handleChatGPT
  }

  async handleCommand(message: proto.IWebMessageInfo) {
    const command = this.extractCommand(message)
    if (!command) return

    const handler = this.commands[command]
    if (handler) {
      await handler(message)
    }
  }

  private extractCommand(message: proto.IWebMessageInfo): string | null {
    const body = message.message?.conversation || 
                 message.message?.extendedTextMessage?.text || ''
    const command = body.toLowerCase().split(' ')[0]
    return command.startsWith('.') ? command.slice(1) : null
  }

  // Command Implementations
  private async handleAllMenu(message: proto.IWebMessageInfo) {
    const menuText = `
🤖 *Bot Command Menu* 🤖

◈ Available Menus:
├• .aimenu
├• .animemenu
├• .botmenu
├• .dlmenu
├• .economy
├• .funmenu
├• .gamesmenu
├• .groupmenu
...and more!

Type a specific menu to explore more!
    `
    await this.replyMessage(message, menuText)
  }

  private async handleAIMenu(message: proto.IWebMessageInfo) {
    const aiMenuText = `
🧠 *AI Commands* 🧠

Available AI Tools:
├• .chatgpt [query]
├• .imagine [description]
├• .translate [lang] [text]
    `
    await this.replyMessage(message, aiMenuText)
  }

  private async handleChatGPT(message: proto.IWebMessageInfo) {
    const query = this.extractArguments(message)
    try {
      const response = await this.aiService.generateText(query)
      await this.replyMessage(message, response)
    } catch (error) {
      await this.replyMessage(message, "Sorry, I couldn't process your request.")
    }
  }

  private async handleImageGeneration(message: proto.IWebMessageInfo) {
    const description = this.extractArguments(message)
    try {
      const response = await this.aiService.generateImage(description)
      if (response) {
        await this.replyMessage(message, response)
      } else {
        await this.replyMessage(message, "Sorry, I couldn't generate an image.")
      }
    } catch (error) {
      await this.replyMessage(message, "Image generation failed.")
    }
  }

  private async replyMessage(message: proto.IWebMessageInfo, text: string) {
    const jid = message.key.remoteJid
    if (jid) {
      await this.socket.sendMessage(jid, { text })
    }
  }

  private extractArguments(message: proto.IWebMessageInfo): string {
    const body = message.message?.conversation || 
                 message.message?.extendedTextMessage?.text || ''
    return body.split(' ').slice(1).join(' ')
  }

  // More command handlers...
} 