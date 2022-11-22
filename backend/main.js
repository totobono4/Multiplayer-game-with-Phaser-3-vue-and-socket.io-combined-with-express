const path = require('path')

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
    socket.emit('uid', gameServer.createUser(pseudo))
  })
})

server.listen(port, () => {
  console.log(`Serveur Graph-Form à l'écoute sur le port ${port}!`)
})

app.get('/play', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
