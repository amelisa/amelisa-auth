import assert from 'assert'
import util from '../util'
import { default as confirmEmailInit } from '../../src/api/confirmEmail'

let auth
let confirmEmail
let model
let userId
let email

before(async () => {
  auth = await util.getAuth()
  confirmEmail = confirmEmailInit.bind(auth)
})

describe('confirmEmail', () => {
  beforeEach(async () => {
    model = auth.store.createModel()
    userId = model.id()
    email = util.generateEmail()
  })

  it('should confirmEmail', async () => {
    let user = {
      id: userId,
      local: {
        emailConfirm: {
          date: Date.now(),
          email
        }
      }
    }
    await model.add('auths', user)
    let data = await confirmEmail(userId)

    assert(!data)

    await model.fetch('auths', userId)
    assert.equal(model.get('auths', userId, 'email'), email)
  })

  it('should not confirmEmail if already confirmed', async () => {
    let user = {
      id: userId,
      local: {
      }
    }
    await model.add('auths', user)
    let data = await confirmEmail(userId)
    assert(data && data.info)
  })

  it('should not confirmEmail expired', async () => {
    let user = {
      id: userId,
      local: {
        emailConfirm: {
          date: Date.now() - 12 * 60 * 1000 * 1000,
          email
        }
      }
    }
    await model.add('auths', user)
    let data = await confirmEmail(userId)
    assert(data && data.info)
  })
})
