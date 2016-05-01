import assert from 'assert'
import util from '../util'
import { default as registerInit } from '../../src/api/register'

let auth
let register
let model
let userId
let email
let password
let userData

before(async () => {
  auth = await util.getAuth()
  register = registerInit.bind(auth)
})

describe('register', () => {
  beforeEach(async () => {
    model = auth.store.createModel()
    userId = model.id()
    email = util.generateEmail()
    password = util.generatePassword()
    userData = {
      a: 'b'
    }
  })

  it('should register and create user', async () => {
    let data = await register(userId, email, password, userData)
    assert(!data)
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert(user)
    assert.equal(user.id, userId)
    assert.equal(user.email, email)
    assert.equal(user.a, userData.a)
    assert(user.local)
    assert(user.local.hash)
    assert(util.compare(password, user.local.hash))
  })

  it('should just save profile if user with userId exists but without provider', async () => {
    let dbUser = {
      id: userId
    }
    await model.add('auths', dbUser)
    let data = await register(userId, email, password, userData)
    assert(!data)
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert(user)
    assert.equal(user.id, userId)
    assert(!user.email)
    assert(!user.a)
    assert(user.local)
    assert(user.local.hash)
    assert(util.compare(password, user.local.hash))
  })

  it('should not register when user with same email exists', async () => {
    let dbUser = {
      email: email
    }
    await model.add('auths', dbUser)
    let data = await register(userId, email, password, userData)
    assert(data && data.info)
  })

  it('should not register when user with same userId and provider exists', async () => {
    let dbUser = {
      id: userId,
      local: {}
    }
    await model.add('auths', dbUser)
    let data = await register(userId, email, password, userData)
    assert(data && data.info)
  })
})
