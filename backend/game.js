const { uid } = require('uid')
const { EventEmitter } = require('node:events')

class ServerEvent extends EventEmitter {}
const serverEvent = new ServerEvent()

const serverEvents = {
  PLAYER_LOGGED: 'playerLogged',
  PLAYER_READY: 'playerReady',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_STATE: 'playerState',
  PLAYER_LEFT: 'playerLeft'
}

const userStates = {
  DISCONNECTED: 'disconnected',
  WAITING: 'waiting',
  PLAYING: 'playing'
}

class Room {
  constructor () {
    this.uid = uid()
    this.userIds = []
  }

  addUser (userId) {
    this.userIds.push(userId)
  }

  get free () {
    return true
  }
}

class User {
  constructor (pseudo) {
    this.pseudo = pseudo
    this.socket = null
    this.state = userStates.DISCONNECTED

    this.uid = uid()
    this.roomId = null
  }

  setRoom (roomId) {
    this.roomId = roomId
  }
}

class GameServer {
  constructor () {
    this.serverEvent = serverEvent
    this.serverEvents = serverEvents

    this.rooms = []
    this.users = []
  }

  createRoom () {
    const room = new Room()
    this.rooms.push(room)
    return room
  }

  get freeRoom () {
    return this.rooms.find(room => {
      return room.free
    })
  }

  createUser (pseudo, socket) {
    const user = new User(pseudo)
    this.users.push(user)

    let room = gameServer.freeRoom

    if (!room) {
      room = gameServer.createRoom()
    }

    user.setRoom(room.uid)
    room.addUser(user.uid)

    socket.emit(serverEvents.PLAYER_LOGGED, {
      userId: user.uid,
      roomId: room.uid
    })
  }

  deleteUser (userId) {
    const deletedUser = this.getUserByUid(userId)
    if (!deletedUser) return

    this.users = this.users.filter(user => {
      return deletedUser.uid !== user.uid
    })

    return deletedUser
  }

  getRoomByUid (uid) {
    return this.rooms.find(room => {
      return room.uid === uid
    })
  }

  getUserByUid (uid) {
    return this.users.find(user => {
      return user.uid === uid
    })
  }
}

const gameServer = new GameServer()

/**
 * Quand un joueur est prêt à rejoindre la partie, il faut le faire rejoindre.
 *
 * Cet événement contient des données utiles à un joueur prêt à rejoindre la partie.
 * - userId: l'id du joueur qui est prêt à rejoindre la partie.
 */
serverEvent.on(serverEvents.PLAYER_READY, ready => {
  console.log(`Server Event ${serverEvents.PLAYER_JOINED} a user is ready to join`)

  const user = gameServer.getUserByUid(ready.userId)
  if (!user) return
  const room = gameServer.getRoomByUid(user.roomId)
  if (!room) return

  if (user.state !== userStates.DISCONNECTED) return

  console.log(`Server Event ${serverEvents.PLAYER_READY} ${user.uid}(${user.pseudo}) in room ${room.uid}`)

  user.state = userStates.WAITING

  serverEvent.emit(serverEvents.PLAYER_JOINED, ({
    userId: ready.userId,
    roomId: room.uid
  }))
})

/**
 * Quand un joueur rejoind la partie, il faut prévenir tous le monde.
 *
 * Cet événement contient des données utiles à la connexion d'un joueur.
 * - userId: l'id du joueur qui rejoind la partie.
 * - roomId: la room à laquelle appartient ce joueur.
 */
serverEvent.on(serverEvents.PLAYER_JOINED, player => {
  console.log(`Server Event ${serverEvents.PLAYER_JOINED} a user is trying to join`)

  const user = gameServer.getUserByUid(player.userId)
  if (!user) return
  const room = gameServer.getRoomByUid(player.roomId)
  if (!room) return

  if (user.state !== userStates.WAITING) return

  console.log(`Server Event ${serverEvents.PLAYER_JOINED} ${user.uid}(${user.pseudo}) in room ${room.uid}`)

  user.socket.emit(serverEvents.PLAYER_JOINED, player)
  user.socket.broadcast.emit(serverEvents.PLAYER_JOINED, player)

  for (const inRoomUserId of room.userIds) {
    const inRoomUser = gameServer.getUserByUid(inRoomUserId)
    if (inRoomUser.state !== userStates.PLAYING) continue
    if (user.uid === inRoomUser.uid) continue
    user.socket.emit(serverEvents.PLAYER_JOINED, {
      userId: inRoomUser.uid,
      roomId: inRoomUser.roomId
    })
  }

  user.state = userStates.PLAYING

  user.socket.on(serverEvents.PLAYER_STATE, state => {
    serverEvent.emit(serverEvents.PLAYER_STATE, state)
  })
})

/**
 * Quand un joueur envoie son nouvel état, il faut prévenir tous les autres joueurs.
 *
 * Cet évennement contient toutes les informations de l'état d'un joueur.
 * Peu importe son contenu, il est relayé par le serveur mais défini dans Phaser3 côté front.
 */
serverEvent.on(serverEvents.PLAYER_STATE, state => {
  const user = gameServer.getUserByUid(state.userId)
  if (!user) return

  // console.log(`Server Event ${serverEvents.PLAYER_STATE}`)

  user.socket.broadcast.emit(serverEvents.PLAYER_STATE, state)
})

/**
 * Quand un joueur quitte la partie, il faut prévenir tous les autres joueurs.
 *
 * Cet événement contient des données utiles à la déconnexion d'un joueur.
 * - userId: l'id du joueur qui quitte la partie.
 * - roomId: la room à laquelle appartenait ce joueur.
 */
serverEvent.on(serverEvents.PLAYER_LEFT, left => {
  const user = gameServer.getUserByUid(left.userId)
  if (!user) return

  if (user.state !== userStates.PLAYING) return

  console.log(`Server Event ${serverEvents.PLAYER_LEFT} ${user.uid}(${user.pseudo})`)

  user.state = userStates.DISCONNECTED

  user.socket.broadcast.emit(serverEvents.PLAYER_LEFT, left)
})

module.exports = gameServer
