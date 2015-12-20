import assert from 'assert'
import util from '../util'
import { default as routeChangeEmailInit } from '../../src/routes/routeChangeEmail'

let auth
let routeChangeEmail
let req
let email
let password
let userId

before(async () => {
  auth = await util.getAuth()
  routeChangeEmail = routeChangeEmailInit.bind(auth)
})

describe('routeChangeEmail', () => {
  beforeEach(async () => {
    let model = auth.store.createModel()
    email = util.generateEmail()
    password = util.generatePassword()
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
        email: 'new@email.com'
      },
      session: {
        userId
      }
    }
    await model.add('auths', user)
  })

  it('should change email', async () => {
    let data = await routeChangeEmail(req)
    assert(!data)
  })
})
