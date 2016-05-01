import { Store } from 'amelisa'
import { MemoryStorage } from 'amelisa/mongo-server'
import supertest from 'supertest-as-promised'
import bcrypt from 'bcrypt'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
let MemoryStore = session.MemoryStore
import auth from '../src'

let minFactor = 4
let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function gen () {
  let text = ''
  for (let i = 0; i < 6; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function getStore () {
  let storage = new MemoryStorage()
  await storage.init()
  let store = new Store({storage})
  return store
}

async function getAuth () {
  let store = await getStore()
  auth.middleware(store)
  return auth
}

async function getApp () {
  let auth = await getAuth()
  let store = auth.store
  let memoryStore = new MemoryStore()
  let sessionOptions = {
    secret: 'secret',
    store: memoryStore,
    resave: false,
    saveUninitialized: false
  }
  let app = express()
  app.use(session(sessionOptions))
  app.use(bodyParser.json())
  app.use(store.modelMiddleware())
  app.use(auth.middleware(store))
  app.auth = auth
  app.memoryStore = memoryStore
  return app
}

async function getRequest () {
  let app = await getApp()
  let request = supertest(app)
  request.app = app
  return request
}

function getCookie (res) {
  let setCookies = res.headers['set-cookie']
  if (!setCookies) return
  let setCookie = setCookies[0]
  return setCookie.slice(0, setCookie.indexOf(';'))
}

function getSessionId (res) {
  let cookie = getCookie(res)
  return cookie.split('=')[1].split('.')[0].slice(4)
}

function getUserIdFromSession (res, memoryStore) {
  let sessionId = getSessionId(res)

  return new Promise((resolve, reject) => {
    memoryStore.get(sessionId, (err, session) => {
      if (err) return reject(err)

      resolve(session.userId)
    })
  })
}

function generateEmail () {
  return (gen() + '@' + gen() + '.com').toLowerCase()
}

function generatePassword () {
  return gen()
}

function makeHash (password) {
  return bcrypt.hashSync(password, minFactor)
}

function clone (object) {
  return JSON.parse(JSON.stringify(object))
}

export default {
  getStore,
  getAuth,
  getApp,
  getRequest,
  getCookie,
  getSessionId,
  getUserIdFromSession,
  generateEmail,
  generatePassword,
  makeHash,
  compare: bcrypt.compareSync,
  clone
}
