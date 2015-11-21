import assert from 'assert'
import util from '../util'
import { default as routeRegisterInit } from '../../lib/routes/routeRegister'

let auth
let routeRegister
let req
let email
let password
let userId

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      routeRegister = routeRegisterInit.bind(auth)
    })
})

describe('routeRegister', () => {
  beforeEach(() => {
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

  it('should register and login', () => {
    return routeRegister(req)
      .then((data) => {
        assert(!data)
        assert.equal(req.session.userId, userId)
      })
  })
})
