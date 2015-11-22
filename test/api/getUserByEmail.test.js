import assert from 'assert'
import util from '../util'
import { default as getUserByEmailInit } from '../../src/api/getUserByEmail'

let auth
let getUserByEmail
let email
let userId

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      getUserByEmail = getUserByEmailInit.bind(auth)
    })
})

describe('getUserByEmail', () => {
  beforeEach(() => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    userId = model.id()
    let user = {
      _id: userId,
      email: email
    }
    return model.add('auths', user)
  })

  it('should get user', () => {
    return getUserByEmail(email)
      .then((user) => {
        assert(user)
        assert.equal(user._id, userId)
      })
  })

  it('should get user when uppercase email', () => {
    return getUserByEmail(email.toUpperCase())
      .then((user) => {
        assert(user)
        assert.equal(user._id, userId)
      })
  })

  it('should not get user when wrong email', () => {
    return getUserByEmail('wrong@email.com')
      .then((user) => {
        assert(!user)
      })
  })
})
