const { uid } = require('uid')
const { EventEmitter } = require('node:events')

class ServerEvent extends EventEmitter {}
const serverEvent = new ServerEvent()

const serverEvents = {
  PLAYER_LOGGED: 'playerLogged',
  PLAYER_READY: 'playerReady',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_STATE: 'playerState'
}

const userStates = {
  WAITING: 'waiting',
  PLAYING: 'playing'
}

class Room {
  constructor () {
    this.uid = uid()
    this.userIds = []
  }

  addUser (user) {
    this.userIds.push(user.uid)
  }

  get free () {
    return true
  }
}

class User {
  constructor (pseudo) {
    this.pseudo = pseudo
    this.socket = null
    this.state = userStates.WAITING

    this.uid = uid()
    this.roomId = null
  }

  setRoom (room) {
    this.roomId = room.uid
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
    return room.uid
  }

  get freeRoom () {
    return this.rooms.find((room) => {
      return room.free
    })
  }

  createUser (pseudo) {
    const user = new User(pseudo)
    this.users.push(user)
    serverEvent.emit(serverEvents.PLAYER_LOGGED, user)
    return user.uid
  }

  getUserByUid (uid) {
    return this.users.find((user) => {
      return user.uid === uid
    })
  }
}

const gameServer = new GameServer()

serverEvent.on(serverEvents.PLAYER_LOGGED, (user) => {
  const freeRoom = gameServer.freeRoom

  if (!freeRoom) {
    gameServer.createRoom()
    serverEvent.emit(serverEvents.PLAYER_LOGGED, user)
  } else {
    user.setRoom(freeRoom)
    freeRoom.addUser(user)
  }
})

serverEvent.on(serverEvents.PLAYER_READY, (ready) => {
  serverEvent.emit(serverEvents.PLAYER_JOINED, ({
    uid: ready.uid
  }))
})

serverEvent.on(serverEvents.PLAYER_JOINED, (player) => {
  const user = gameServer.getUserByUid(player.uid)
  if (!user) return
  user.socket.emit(serverEvents.PLAYER_JOINED, player)
  user.state = userStates.PLAYING
})

module.exports = gameServer
