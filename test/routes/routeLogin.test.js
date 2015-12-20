import assert from 'assert'
import util from '../util'
import { default as routeLoginInit } from '../../src/routes/routeLogin'

let auth
let routeLogin
let req
let email
let password
let userId

before(async () => {
  auth = await util.getAuth()
  routeLogin = routeLoginInit.bind(auth)
})

describe('routeLogin', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    password = util.generatePassword()
    userId = model.id()
    let user = {
      _id: userId,
      email: email,
      local: {
        hash: util.makeHash(password)
      }
    }
    req = {
      body: {
        email,
        password
      },
      session: {},
      login: (userId, next) => next()
    }
    await model.add('auths', user)
  })

  it('should login', async () => {
    let data = await routeLogin(req)
    assert(!data)
    assert.equal(req.session.userId, userId)
  })

  it('should not login when no email', async () => {
    delete req.body.email
    let data = await routeLogin(req)
    assert(data && data.info)
    assert(!req.session.userId)
  })
})
