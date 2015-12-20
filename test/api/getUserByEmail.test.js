import assert from 'assert'
import util from '../util'
import { default as getUserByEmailInit } from '../../src/api/getUserByEmail'

let auth
let getUserByEmail
let email
let userId

before(async () => {
  auth = await util.getAuth()
  getUserByEmail = getUserByEmailInit.bind(auth)
})

describe('getUserByEmail', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    userId = model.id()
    let user = {
      _id: userId,
      email: email
    }
    await model.add('auths', user)
  })

  it('should get user', async () => {
    let user = await getUserByEmail(email)
    assert(user)
    assert.equal(user._id, userId)
  })

  it('should get user when uppercase email', async () => {
    let user = await getUserByEmail(email.toUpperCase())
    assert(user)
    assert.equal(user._id, userId)
  })

  it('should not get user when wrong email', async () => {
    let user = await getUserByEmail('wrong@email.com')
    assert(!user)
  })
})
