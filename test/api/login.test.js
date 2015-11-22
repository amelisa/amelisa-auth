import assert from 'assert'
import util from '../util'
import { default as loginInit } from '../../src/api/login'

let auth
let login
let dbUser

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      login = loginInit.bind(auth)
    })
})

describe.skip('login', () => {
  it('should set req.user and req.session.userId', () => {
    let req = {
      session: {}
    }
    return login(dbUser._id, req)
      .then(() => {
        assert(req.user)
        assert.equal(req.user, dbUser._id)
        assert(req.session.userId)
        assert.equal(req.session.userId, dbUser._id)
      })
  })
})
