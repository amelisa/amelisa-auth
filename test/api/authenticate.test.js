import assert from 'assert'
import util from '../util'
import { default as authenticateInit } from '../../src/api/authenticate'

let auth
let authenticate
let email
let password
let userId

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      authenticate = authenticateInit.bind(auth)
    })
})

describe('authenticate', () => {
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
    return model.add('auths', user)
  })

  it('should authenticate and return userId', () => {
    return authenticate(email, password)
      .then((id) => {
        assert(id)
        assert.equal(id, userId)
      })
  })

  it('should authenticate and return userId with uppercase email', () => {
    return authenticate(email.toUpperCase(), password)
      .then((id) => {
        assert(id)
        assert.equal(id, userId)
      })
  })

  it('should not authenticate with wrong email', () => {
    return authenticate('wrong@email.com', password)
      .then((userId) => {
        assert(!userId)
      })
  })

  it('should not authenticate with wrong password', () => {
    return authenticate(email, 'wrongpassword')
      .then((userId) => {
        assert(!userId)
      })
  })

  it('should not authenticate with uppercase password', () => {
    return authenticate(email, password.toUpperCase())
      .then((userId) => {
        assert(!userId)
      })
  })
})
