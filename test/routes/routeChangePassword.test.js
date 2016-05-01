import assert from 'assert'
import util from '../util'
import { default as routeChangePasswordInit } from '../../src/routes/routeChangePassword'

let auth
let routeChangePassword
let req
let email
let password
let newpassword
let userId

before(async () => {
  auth = await util.getAuth()
  routeChangePassword = routeChangePasswordInit.bind(auth)
})

describe('routeChangePassword', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    password = util.generatePassword()
    newpassword = util.generatePassword()
    userId = model.id()
    let user = {
      id: userId,
      email: email,
      local: {
        hash: util.makeHash(password)
      }
    }
    req = {
      body: {
        oldpassword: password,
        password: newpassword,
        confirm: newpassword
      },
      session: {
        userId
      }
    }
    await model.add('auths', user)
  })

  it('should change password', async () => {
    let data = await routeChangePassword(req)
    assert(!data)
  })
})
