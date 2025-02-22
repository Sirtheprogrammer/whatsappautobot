import { GeminiAIService } from '../../services/aiService'

// Mock the Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Mocked AI response' }
      })
    })
  }))
}))

describe('GeminiAIService', () => {
  let aiService: GeminiAIService

  beforeEach(() => {
    // Mock environment variable
    process.env.VITE_GEMINI_API_KEY = 'test-key'
    aiService = new GeminiAIService()
  })

  test('generateText returns mocked response', async () => {
    const result = await aiService.generateText('Test prompt')
    expect(result).toBe('Mocked AI response')
  })

  test('generateImage should return a string or null', async () => {
    const result = await aiService.generateImage('A beautiful landscape')
    expect(result).toBeTruthy()
  })

  test('chatCompletion should handle multiple messages', async () => {
    const messages = ['Hello', 'How are you?', 'Tell me a joke']
    const result = await aiService.chatCompletion(messages)
    expect(typeof result).toBe('string')
  })
}) 