import assert from 'assert'
import util from '../util'
import { default as routeRegisterInit } from '../../src/routes/routeRegister'

let auth
let routeRegister
let req
let email
let password
let userId

before(async () => {
  auth = await util.getAuth()
  routeRegister = routeRegisterInit.bind(auth)
})

describe('routeRegister', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    password = util.generatePassword()
    userId = model.id()
    req = {
      body: {
        email,
        password,
        confirm: password
      },
      session: {
        userId
      },
      login: (userId, next) => next()
    }
  })

  it('should register and login', async () => {
    let data = await routeRegister(req)
    assert(data && data.userId)
    assert.equal(data.userId, userId)
    assert.equal(req.session.userId, userId)
  })
})
