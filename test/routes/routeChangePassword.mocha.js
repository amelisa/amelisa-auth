import assert from 'assert'
import util from '../util'
import { default as routeChangePasswordInit } from '../../lib/routes/routeChangePassword'

let auth
let routeChangePassword
let req
let email
let password
let newpassword
let userId

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      routeChangePassword = routeChangePasswordInit.bind(auth)
    })
})

describe('routeChangePassword', () => {
  beforeEach(() => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    password = util.generatePassword()
    newpassword = util.generatePassword()
    userId = model.id()
    let user = {
      _id: userId,
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
    return model.add('auths', user)
  })

  it('should change password', () => {
    routeChangePassword(req)
      .then((data) => {
        assert(!data)
      })
  })
})
