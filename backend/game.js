const { uid } = require('uid')

class Room {
  constructor () {
    this.uid = uid()
  }
}

class User {
  constructor () {
    this.uid = uid()
  }
}
