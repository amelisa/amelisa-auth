import assert from 'assert'
import util from '../util'
import { default as passwordMatchInit } from '../../lib/api/passwordMatch'

let auth
let passwordMatch
let model
let userId
let password

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      passwordMatch = passwordMatchInit.bind(auth)
    })
})

describe('passwordMatch', () => {
  beforeEach(() => {
    model = auth.store.createModel()
    userId = model.id()
    password = util.generatePassword()
  })

  it('should passwordMatch', () => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(password)
      }
    }

    return passwordMatch(user, password)
      .then((match) => {
        assert(match)
      })
  })

  it('should not passwordMatch', () => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(password)
      }
    }
    password = util.generatePassword()

    return passwordMatch(user, password)
      .then((match) => {
        assert(!match)
      })
  })
})
