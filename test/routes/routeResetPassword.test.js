import assert from 'assert'
import util from '../util'
import { default as routeResetPasswordInit } from '../../src/routes/routeResetPassword'

let auth
let routeResetPassword
let req
let email
let secret
let password
let userId

before(async () => {
  auth = await util.getAuth()
  routeResetPassword = routeResetPasswordInit.bind(auth)
})

describe('routeResetPassword', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    secret = model.id()
    password = util.generatePassword()
    userId = model.id()
    let user = {
      id: userId,
      email: email,
      local: {
        secret
      }
    }
    req = {
      body: {
        secret,
        password,
        confirm: password
      },
      session: {
        userId
      }
    }
    await model.add('auths', user)
  })

  it('should reset password', async () => {
    let data = await routeResetPassword(req)
    assert(!data)
  })
})
