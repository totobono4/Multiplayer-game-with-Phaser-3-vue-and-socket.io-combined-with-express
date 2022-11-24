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
    this.state = userStates.WAITING

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

serverEvent.on(serverEvents.PLAYER_READY, ready => {
  // console.log(`Server event ${gameServer.serverEvents.PLAYER_READY}`)

  const user = gameServer.getUserByUid(ready.userId)
  if (!user) return
  const room = gameServer.getRoomByUid(user.roomId)
  if (!room) return
  serverEvent.emit(serverEvents.PLAYER_JOINED, ({
    userId: ready.userId,
    roomId: room.uid
  }))
})

serverEvent.on(serverEvents.PLAYER_JOINED, player => {
  // console.log(`Server event ${gameServer.serverEvents.PLAYER_JOINED}`)

  const user = gameServer.getUserByUid(player.userId)
  if (!user) return
  const room = gameServer.getRoomByUid(player.roomId)
  if (!room) return

  user.socket.emit(serverEvents.PLAYER_JOINED, player)
  user.socket.broadcast.emit(serverEvents.PLAYER_JOINED, player)

  for (const inRoomUserId of room.userIds) {
    const inRoomUser = gameServer.getUserByUid(inRoomUserId)
    if (user.uid === inRoomUser.uid) continue
    user.socket.emit(serverEvents.PLAYER_JOINED, {
      userId: inRoomUser.uid,
      roomId: inRoomUser.roomId
    })
  }

  user.state = userStates.PLAYING

  user.socket.on(serverEvents.PLAYER_STATE, state => {
    // console.log(`Socket event ${gameServer.serverEvents.PLAYER_STATE}`)

    serverEvent.emit(serverEvents.PLAYER_STATE, state)
  })
})

serverEvent.on(serverEvents.PLAYER_STATE, state => {
  // console.log(`Server event ${gameServer.serverEvents.PLAYER_STATE}`)

  const user = gameServer.getUserByUid(state.userId)
  if (!user) return

  user.socket.broadcast.emit(serverEvents.PLAYER_STATE, state)
})

module.exports = gameServer
