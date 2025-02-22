import { Server } from 'socket.io'
import { io as Client } from 'socket.io-client'

describe('WebSocket Bot Interactions', () => {
  let io: Server
  let clientSocket: any

  beforeEach((done) => {
    // Setup mock WebSocket server
    io = new Server()
    io.listen(3000)
    
    clientSocket = Client('http://localhost:3000')
    clientSocket.on('connect', done)
  })

  afterEach(() => {
    io.close()
    clientSocket.close()
  })

  test('bot receives message', (done) => {
    io.on('connection', (socket) => {
      socket.on('bot_message', (msg) => {
        expect(msg).toBeDefined()
        done()
      })
    })

    clientSocket.emit('bot_message', { text: 'Hello Bot' })
  })
}) 