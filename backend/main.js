const path = require('path')

const frontPath = path.resolve('/front')

require('dotenv').config()
const port = process.env.port

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
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('pseudo', (pseudo) => {
    if (typeof (pseudo) !== 'string') return
    socket.emit('uid', gameServer.createUser(pseudo))
  })

  socket.on('message', async (message) => {
    console.dir(message)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
    await delay(1000) /// waiting 1 second.
    io.emit('reponse', message)
  })
})

server.listen(port, () => {
  console.log(`Serveur Graph-Form à l'écoute sur le port ${port}`)
})

app.use(history())
app.use(express.static(frontPath))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(frontPath, 'index.html'))
})
