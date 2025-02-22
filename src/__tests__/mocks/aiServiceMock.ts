import { GeminiAIService } from '../../services/aiService'

export function mockGeminiAIService() {
  return jest.spyOn(GeminiAIService.prototype, 'generateText')
    .mockImplementation(async (prompt: string) => {
      return `Mocked response for: ${prompt}`
    })
} 