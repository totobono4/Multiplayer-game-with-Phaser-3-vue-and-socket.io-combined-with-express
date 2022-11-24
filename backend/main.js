const path = require('path')

const frontPath = path.resolve('/front')

require('dotenv').config()
const PORT = process.env.PORT || 3000

const history = require('connect-history-api-fallback')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

const gameServer = require('./game')

io.on('connection', (socket) => {
  console.log('user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('connecting', connecting => {
    const pseudo = connecting.pseudo
    if (typeof (pseudo) !== 'string') return
    console.log('user registered')
    gameServer.createUser(pseudo, socket)
  })

  socket.on(gameServer.serverEvents.PLAYER_READY, ready => {
    const user = gameServer.getUserByUid(ready.userId)
    if (!user) return

    user.socket = socket
    gameServer.serverEvent.emit(gameServer.serverEvents.PLAYER_READY, ready)

    socket.on('disconnect', () => {
      gameServer.serverEvent.emit(gameServer.serverEvents.PLAYER_LEFT, {
        userId: user.uid
      })
    })
  })
})

server.listen(PORT, () => {
  console.log('Serveur Graph-Form ouvert!')
})

app.use(history())
app.use(express.static(frontPath))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(frontPath, 'index.html'))
})
