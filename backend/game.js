const { uid } = require('uid')
const { EventEmitter } = require('node:events')

class ServerEvent extends EventEmitter {}
const serverEvent = new ServerEvent()

/**
 * Les différents events du serveur.
 * On s'en sert aussi pour communiquer avec les sockets des utilisateurs, ce sont des events serveurs.
 */
const serverEvents = {
  PLAYER_LOGGED: 'playerLogged',
  PLAYER_READY: 'playerReady',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_STATE: 'playerState',
  PLAYER_LEFT: 'playerLeft'
}

/**
 * Les états d'un utilisateur
 */
const userStates = {
  DISCONNECTED: 'disconnected',
  WAITING: 'waiting',
  PLAYING: 'playing'
}

/**
 * Les constantes de jeu
 */
const gameConsts = {
  MAX_ROOM_CAPACITY: 2
}

/**
 * La classe Room, c'est un salon dans lequel un certain nombre de joueurs peuvent accéder.
 * Les joueurs sont automatiquement ajoutés aux salons qui ont de la place, on en créer de nouveaux si y'a pas assez de place.
 *
 * attributs:
 * - uid: un identifiant unique rien que pour elle.
 * - usersIds: les identifiants uniques des utilisateurs présents dedans.
 */
class Room {
  constructor () {
    this.uid = uid()
    this.userIds = []
  }

  /**
   * addUser(): pour ajouter un utilisateur dans la room.
   * @param {string} userId : l'id de l'utilisateur
   */
  addUser (userId) {
    this.userIds.push(userId)
  }

  /**
   * deleteUser(): pour supprimer un utilisateur de la room.
   * @param {string} userId : l'id de l'utilisateur
   * @returns {string} : l'id de l'utilisateur
   */
  deleteUser (userId) {
    this.userIds = this.userIds.filter(deletedUserId => {
      return userId !== deletedUserId
    })

    return userId
  }

  /**
   * free(): pour savoir si y'a de la place ici.
   */
  get free () {
    return this.userIds.length < gameConsts.MAX_ROOM_CAPACITY
  }
}

/**
 * Les utilisateus, bientôt des joueurs !
 * Cette classe gère tout ce qu'est un utilisateur.
 *
 * attributs:
 * - pseudo: le pseudo de l'utilisateur.
 * - socket: la socket de l'utilisateur pour communiquer avec lui.
 * - state: l'état de l'utilisateur sur le serveur de jeu.
 * - uid: un identifiant unique pour l'utilisateur.
 * - roomId: l'identifiant de la room à laquelle appartient l'utilisateur.
 */
class User {
  constructor (pseudo) {
    this.pseudo = pseudo
    this.socket = null
    this.state = userStates.DISCONNECTED

    this.uid = uid()
    this.roomId = null
  }

  /**
   * setRoom(): pour affecter une nouvelle room à cet utilisateur.
   * @param {string} roomId : l'id de la room
   */
  setRoom (roomId) {
    this.roomId = roomId
  }
}

/**
 * ça c'est la classe qui gère tout le serveur de jeu.
 *
 * attributs:
 * - serverEvent: une classe d'événements pour accéder aux événements du serveur en dehors.
 * - serverEvents: Une liste des différents événements du serveur.
 * - rooms: les rooms du serveur.
 * - users: les utilisateurs connectés au serveur.
 */
class GameServer {
  constructor () {
    this.serverEvent = serverEvent
    this.serverEvents = serverEvents

    this.rooms = []
    this.users = []
  }

  /**
   * createRoom(): permet de créer une nouvelle room sur le serveur.
   * @returns {Room} la room créee
   */
  createRoom () {
    const room = new Room()
    this.rooms.push(room)
    return room
  }

  /**
   * freeRoom(): permet de récupérer une room libre sur le serveur.
   */
  get freeRoom () {
    return this.rooms.find(room => {
      return room.free
    })
  }

  /**
   * createUser(): permet de créer un nouvel utilisateur sur le serveur.
   * @param {string} pseudo : le pseudo de l'utilisateur
   * @param {*} socket : le socket pour communiquer avec l'utilisateur.
   */
  createUser (pseudo, socket) {
    const user = new User(pseudo)
    this.users.push(user)

    socket.emit(serverEvents.PLAYER_LOGGED, {
      userId: user.uid
    })
  }

  /**
   * canUserConnect(): permet de savoir si un utilisateur avec un uid enregistré dans son navigateur peut se connecter (déjà en train de jouer ?)
   * @param {string} userId : l'id de l'utilisateur.
   * @returns {bool} si l'utilisateur peut se connecter ou non.
   */
  canUserConnect (userId) {
    const user = this.getUserByUid(userId)
    return !user || user.state === userStates.DISCONNECTED
  }

  /**
   * deleteUser(): permet de supprimer un utilisateur du serveur.
   * @param {*} userId : l'id de l'utilisateur.
   * @returns l'utilisateur supprimé
   */
  deleteUser (userId) {
    const deletedUser = this.getUserByUid(userId)
    if (!deletedUser) return null

    this.users = this.users.filter(user => {
      return deletedUser.uid !== user.uid
    })

    return deletedUser
  }

  /**
   * getRoomByUid(): permet de récupérer une room avec son uid.
   * @param {string} uid : l'uid de la room
   * @returns {Room} : la room
   */
  getRoomByUid (uid) {
    return this.rooms.find(room => {
      return room.uid === uid
    })
  }

  /**
   * getUserByUid(): permet de récupérer un utilisateur avec son uid.
   * @param {string} uid : l'uid de l'utilisateur
   * @returns {User} l'utilisateur
   */
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
  const user = gameServer.getUserByUid(ready.userId)
  if (!user) return

  if (user.state !== userStates.DISCONNECTED) return

  console.log(`Server Event ${serverEvents.PLAYER_READY} ${user.uid}(${user.pseudo})`)

  user.state = userStates.WAITING

  let room = gameServer.freeRoom

  if (!room) {
    room = gameServer.createRoom()
  }

  user.setRoom(room.uid)
  room.addUser(user.uid)

  serverEvent.emit(serverEvents.PLAYER_JOINED, ({
    userId: ready.userId,
    userPseudo: user.pseudo,
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
      userPseudo: inRoomUser.pseudo,
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

  const room = gameServer.getRoomByUid(user.roomId)
  user.roomId = null
  room.deleteUser(user.uid)

  user.socket.broadcast.emit(serverEvents.PLAYER_LEFT, left)
})

module.exports = gameServer
