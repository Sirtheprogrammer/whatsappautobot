export function parseCommand(message: string): { command: string, args: string[] } {
  const parts = message.trim().split(' ')
  const command = parts[0].replace('.', '').toLowerCase()
  const args = parts.slice(1)
  return { command, args }
}

// Corresponding test
// src/__tests__/utils/commandParser.test.ts
import { parseCommand } from '../../utils/commandParser'

describe('Command Parser', () => {
  test('parses simple command correctly', () => {
    const result = parseCommand('.chatgpt Hello world')
    expect(result).toEqual({
      command: 'chatgpt',
      args: ['Hello', 'world']
    })
  })

  test('handles commands without arguments', () => {
    const result = parseCommand('.allmenu')
    expect(result).toEqual({
      command: 'allmenu',
      args: []
    })
  })
}) 