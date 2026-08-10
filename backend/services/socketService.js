const { Server } = require('socket.io')
const jwt = require('jsonwebtoken')
const config = require('config')

/** @type {import('socket.io').Server | null} */
let io = null

/** @type {Map<string, Set<string>>} */
const userSockets = new Map()

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: [config.get('clientUrl'), 'http://localhost:3000'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token
      if (!token) {
        return next(new Error('Auth token required'))
      }
      const decoded = jwt.verify(token, config.get('jwtSecret'))
      socket.userId = String(decoded.userId)
      next()
    } catch (e) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.userId
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set())
    }
    userSockets.get(userId).add(socket.id)

    socket.join(`user:${userId}`)

    socket.on('disconnect', () => {
      const set = userSockets.get(userId)
      if (!set) return
      set.delete(socket.id)
      if (set.size === 0) userSockets.delete(userId)
    })
  })

  return io
}

function emitToUser(userId, event, payload) {
  if (!io) return
  io.to(`user:${String(userId)}`).emit(event, payload)
}

module.exports = {
  initSocket,
  emitToUser,
  getIO: () => io,
}
