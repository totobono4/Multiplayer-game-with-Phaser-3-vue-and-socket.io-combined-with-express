const path = require('path')

require('dotenv').config()
const port = process.env.port

const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
    // socket.emit('chat message', msg)
    // socket.broadcast.emit('chat message', msg)
    console.log('message: ' + msg)
  })
})

server.listen(port, () => {
  console.log(`Application exemple à l'écoute sur le port ${port}!`)
})

app.use(express.static(path.resolve(__dirname, 'node_modules')))

app.get('/play', (req, res, next) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
