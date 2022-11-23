const path = require('path')

const frontPath = path.resolve('/front')

require('dotenv').config()
const port = process.env.port

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
})

server.listen(port, () => {
  console.log(`Serveur Graph-Form à l'écoute sur le port ${port}`)
})

app.use(express.static(frontPath))

app.get('/', (req, res, next) => {
  res.sendFile(path.resolve('index.html'))
})
