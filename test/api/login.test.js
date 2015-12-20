import assert from 'assert'
import util from '../util'
import { default as loginInit } from '../../src/api/login'

let auth
let login
let dbUser

before(async () => {
  auth = await util.getAuth()
  login = loginInit.bind(auth)
})

describe.skip('login', () => {
  it('should set req.user and req.session.userId', async () => {
    let req = {
      session: {}
    }
    await login(dbUser._id, req)
    assert(req.user)
    assert.equal(req.user, dbUser._id)
    assert(req.session.userId)
    assert.equal(req.session.userId, dbUser._id)
  })
})
