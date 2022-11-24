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

/**
 * Quand une socket se connecte, faut tout gérer
 */
io.on('connection', (socket) => {
  console.log('user connected')

  /**
   * La déconnexion d'une socket
   * */
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  /**
   * La connexion d'une socket.
   * Création d'un utilisateur s'il n'est pas déjà connecté à une partie sur son navigateur.
   */
  socket.on('connecting', connecting => {
    const pseudo = connecting.pseudo
    if (typeof (pseudo) !== 'string') return
    const userId = connecting.userId
    if (userId && !gameServer.canUserConnect(userId)) {
      socket.emit('errorChan', {
        errorCode: 10,
        errorMsg: 'alreadyConnected'
      })
      return
    }
    gameServer.createUser(pseudo, socket)
  })

  /**
   * Quand un joueur est prêt à se connecter, on envoies un événement au serveur de jeu puis tout se passe là-bas.
   */
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

/**
 * Le serveur est ouvert (enfin)
 */
server.listen(PORT, () => {
  console.log('Serveur Graph-Form ouvert!')
})

/**
 * On utilise les routes définies dans le front, ici on s'occupe que de la communication on a pas besoin de faire ça.
 */
app.use(history())
app.use(express.static(frontPath))

/**
 * On prend les routes du front de toute façon
 */
app.get('/', (req, res, next) => {
  res.sendFile(path.resolve(frontPath, 'index.html'))
})
