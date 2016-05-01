import assert from 'assert'
import util from '../util'
import { default as changeEmailInit } from '../../src/api/changeEmail'

let auth
let changeEmail
let model
let userId
let email

before(async () => {
  auth = await util.getAuth()
  changeEmail = changeEmailInit.bind(auth)
})

describe('changeEmail', () => {
  beforeEach(async () => {
    model = auth.store.createModel()
    userId = model.id()
    email = util.generateEmail()
  })

  it('should changeEmail', async () => {
    let user = {
      id: userId,
      email: util.generateEmail()
    }
    await model.add('auths', user)
    let data = await changeEmail(userId, email)
    assert(!data)

    await model.fetch('auths', userId)
    assert.equal(model.get('auths', userId, 'email'), email)
  })

  it('should not changeEmail if same email', async () => {
    let user = {
      id: userId,
      email: email
    }
    await model.add('auths', user)
    let data = await changeEmail(userId, email)
    assert(data && data.info)
  })

  it('should not changeEmail if no user', async () => {
    let data = await changeEmail(userId, email)
    assert(data && data.info)
  })
})
