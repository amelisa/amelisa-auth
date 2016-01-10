import assert from 'assert'
import util from '../util'
import { default as routeConfirmEmailInit } from '../../src/routes/routeConfirmEmail'

let auth
let routeConfirmEmail
let req
let email
let userId

before(async () => {
  auth = await util.getAuth()
  routeConfirmEmail = routeConfirmEmailInit.bind(auth)
})

describe('routeConfirmEmail', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    userId = model.id()
    let user = {
      _id: userId,
      local: {
        emailConfirm: {
          date: Date.now(),
          email
        }
      }
    }
    req = {
      query: {
        id: userId
      },
      session: {},
      login: (userId, next) => next()
    }
    await model.add('auths', user)
  })

  it('should confirm email', async () => {
    let data = await routeConfirmEmail(req)
    assert(!data)
  })
})
