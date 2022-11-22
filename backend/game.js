const { uid } = require('uid')
const { EventEmitter } = require('node:events')

class ServerEvent extends EventEmitter {}
const serverEvent = new ServerEvent()

const serverEvents = {
  PLAYER_JOINED: 'playerJoined'
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
    this.uid = uid()
    this.roomId = null
  }

  setRoom (room) {
    this.roomId = room.uid
  }
}

class GameServer {
  constructor () {
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
    serverEvent.emit(serverEvents.PLAYER_JOINED, user)
    return user.uid
  }
}

const gameServer = new GameServer()

serverEvent.on(serverEvents.PLAYER_JOINED, (user) => {
  const freeRoom = gameServer.freeRoom

  if (!freeRoom) {
    gameServer.createRoom()
    serverEvent.emit(serverEvents.PLAYER_JOINED, user)
  } else {
    user.setRoom(freeRoom)
    freeRoom.addUser(user)
    console.dir(gameServer)
  }
})

module.exports = gameServer
