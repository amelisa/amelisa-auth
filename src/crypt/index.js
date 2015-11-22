import Auth from '../Auth'
import bcrypt from './bcrypt'

let cryptModule

function initCrypt () {
  cryptModule = bcrypt(8)
}

function hash (password) {
  if (!cryptModule) this.initCrypt()
  return cryptModule.hash(password)
}

function compare (password, hash, salt) {
  if (!cryptModule) this.initCrypt()
  return cryptModule.compare(password, hash, salt)
}

Auth.prototype.initCrypt = initCrypt
Auth.prototype.hash = hash
Auth.prototype.compare = compare
