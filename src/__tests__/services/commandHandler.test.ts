import { CommandHandler } from '../../services/commandHandler'
import { WASocket, proto } from '@whiskeysockets/baileys'

describe('CommandHandler', () => {
  let commandHandler: CommandHandler
  let mockSocket: jest.Mocked<WASocket>

  beforeEach(() => {
    mockSocket = {
      sendMessage: jest.fn()
    } as unknown as jest.Mocked<WASocket>

    commandHandler = new CommandHandler(mockSocket)
  })

  test('extractCommand should correctly parse commands', () => {
    const message = {
      message: {
        conversation: '.chatgpt Tell me a joke'
      }
    } as proto.IWebMessageInfo

    const command = (commandHandler as any).extractCommand(message)
    expect(command).toBe('chatgpt')
  })

  test('handleCommand should call correct method', async () => {
    const message = {
      message: {
        conversation: '.chatgpt Tell me a joke'
      },
      key: {
        remoteJid: '1234567890'
      }
    } as proto.IWebMessageInfo

    const spy = jest.spyOn(commandHandler as any, 'handleChatGPT')
    await (commandHandler as any).handleCommand(message)
    expect(spy).toHaveBeenCalled()
  })
}) 