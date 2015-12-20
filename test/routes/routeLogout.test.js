import assert from 'assert'
import util from '../util'
import { default as routeLogoutInit } from '../../src/routes/routeLogout'

let auth
let routeLogout
let req
let email
let password
let userId

before(async () => {
  auth = await util.getAuth()
  routeLogout = routeLogoutInit.bind(auth)
})

describe('routeLogout', () => {
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
      session: {
        userId
      },
      logout: () => {}
    }
    await model.add('auths', user)
  })

  it('should logout', async () => {
    let data = await routeLogout(req)
    assert(!data)
    assert(!req.session.userId)
  })
})
