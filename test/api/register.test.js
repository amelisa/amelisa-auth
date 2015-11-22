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

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      register = registerInit.bind(auth)
    })
})

describe('register', () => {
  beforeEach(() => {
    model = auth.store.createModel()
    userId = model.id()
    email = util.generateEmail()
    password = util.generatePassword()
    userData = {
      a: 'b'
    }
  })

  it('should register and create user', () => {
    return register(userId, email, password, userData)
      .then((data) => {
        assert(!data)
        return model
          .fetch('auths', userId)
          .then(() => {
            let user = model.get('auths', userId)
            assert(user)
            assert.equal(user._id, userId)
            assert.equal(user.email, email)
            assert.equal(user.a, userData.a)
            assert(user.local)
            assert(user.local.hash)
            assert(util.compare(password, user.local.hash))
          })
      })
  })

  it('should just save profile if user with userId exists but without provider', () => {
    let dbUser = {
      _id: userId
    }
    return model
      .add('auths', dbUser)
      .then(() => {
        return register(userId, email, password, userData)
          .then((data) => {
            assert(!data)
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId)
                assert(user)
                assert.equal(user._id, userId)
                assert(!user.email)
                assert(!user.a)
                assert(user.local)
                assert(user.local.hash)
                assert(util.compare(password, user.local.hash))
              })
          })
      })
  })

  it('should not register when user with same email exists', () => {
    let dbUser = {
      email: email
    }
    return model
      .add('auths', dbUser)
      .then(() => {
        return register(userId, email, password, userData)
          .then((data) => {
            assert(data && data.info)
          })
      })
  })

  it('should not register when user with same userId and provider exists', () => {
    let dbUser = {
      _id: userId,
      local: {}
    }
    return model
      .add('auths', dbUser)
      .then(() => {
        return register(userId, email, password, userData)
          .then((data) => {
            assert(data && data.info)
          })
      })
  })
})
