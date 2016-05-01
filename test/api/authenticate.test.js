import assert from 'assert'
import util from '../util'
import { default as authenticateInit } from '../../src/api/authenticate'

let auth
let authenticate
let email
let password
let userId

before(async () => {
  auth = await util.getAuth()
  authenticate = authenticateInit.bind(auth)
})

describe('authenticate', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    password = util.generatePassword()
    userId = model.id()
    let user = {
      id: userId,
      email: email,
      local: {
        hash: util.makeHash(password)
      }
    }
    await model.add('auths', user)
  })

  it('should authenticate and return userId', async () => {
    let id = await authenticate(email, password)
    assert(id)
    assert.equal(id, userId)
  })

  it('should authenticate and return userId with uppercase email', async () => {
    let id = await authenticate(email.toUpperCase(), password)
    assert(id)
    assert.equal(id, userId)
  })

  it('should not authenticate with wrong email', async () => {
    let id = await authenticate('wrong@email.com', password)
    assert(!id)
  })

  it('should not authenticate with wrong password', async () => {
    let id = await authenticate(email, 'wrongpassword')
    assert(!id)
  })

  it('should not authenticate with uppercase password', async () => {
    let id = await authenticate(email, password.toUpperCase())
    assert(!id)
  })
})
