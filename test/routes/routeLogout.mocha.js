import assert from 'assert'
import util from '../util'
import { default as routeLogoutInit } from '../../lib/routes/routeLogout'

let auth
let routeLogout
let req
let email
let password
let userId

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      routeLogout = routeLogoutInit.bind(auth)
    })
})

describe('routeLogout', () => {
  beforeEach(() => {
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
    return model.add('auths', user)
  })

  it('should logout', () => {
    return routeLogout(req)
      .then((data) => {
        assert(!data)
        assert(!req.session.userId)
      })
  })
})
