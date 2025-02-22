import request from 'supertest'
import { createTestServer } from '../../testServer'

describe('Bot Test Server', () => {
  const app = createTestServer()

  test('bot connection endpoint', async () => {
    const response = await request(app)
      .post('/bot/connect')
      .expect(200)
    
    expect(response.body.status).toBe('connected')
  })

  test('bot command handling', async () => {
    const response = await request(app)
      .post('/bot/command')
      .send({ message: '.chatgpt Tell me a joke' })
      .expect(200)
    
    expect(response.body.status).toBe('command processed')
  })
}) 