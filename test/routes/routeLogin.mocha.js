import assert from 'assert'
import util from '../util'
import { default as routeLoginInit } from '../../lib/routes/routeLogin'

let auth
let routeLogin
let req
let email
let password
let userId

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      routeLogin = routeLoginInit.bind(auth)
    })
})

describe('routeLogin', () => {
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
      session: {},
      login: (userId, next) => next()
    }
    return model.add('auths', user)
  })

  it('should login', () => {
    return routeLogin(req)
      .then((data) => {
        assert(!data)
        assert.equal(req.session.userId, userId)
      })
  })

  it('should not login when no email', () => {
    delete req.body.email
    return routeLogin(req)
      .then((data) => {
        assert(data && data.info)
        assert(!req.session.userId)
      })
  })
})
