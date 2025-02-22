import { GoogleGenerativeAI } from "@google/generative-ai"

export class GeminiAIService {
  private genAI: GoogleGenerativeAI
  
  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error("Gemini API key is not configured")
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error("Gemini AI Text Generation Error:", error)
      return "Sorry, I couldn't generate a response right now."
    }
  }

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro-vision" })
      // Note: Gemini doesn't directly generate images like DALL-E
      // This is more for image analysis
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (error) {
      console.error("Gemini AI Image Generation Error:", error)
      return null
    }
  }

  async chatCompletion(messages: string[]): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-pro" })
      const chat = model.startChat({
        history: messages.slice(0, -1).map(msg => ({ role: "user", parts: [{ text: msg }] })),
        generationConfig: {
          maxOutputTokens: 500,
        },
      })

      const result = await chat.sendMessage(messages[messages.length - 1])
      return result.response.text()
    } catch (error) {
      console.error("Gemini AI Chat Error:", error)
      return "Sorry, I couldn't process your request."
    }
  }
} 