import assert from 'assert'
import util from '../util'
import { default as passwordMatchInit } from '../../src/api/passwordMatch'

let auth
let passwordMatch
let model
let userId
let password

before(async () => {
  auth = await util.getAuth()
  passwordMatch = passwordMatchInit.bind(auth)
})

describe('passwordMatch', () => {
  beforeEach(async () => {
    model = auth.store.createModel()
    userId = model.id()
    password = util.generatePassword()
  })

  it('should passwordMatch', async () => {
    let user = {
      id: userId,
      local: {
        hash: util.makeHash(password)
      }
    }

    let match = await passwordMatch(user, password)
    assert(match)
  })

  it('should not passwordMatch', async () => {
    let user = {
      id: userId,
      local: {
        hash: util.makeHash(password)
      }
    }
    password = util.generatePassword()

    let match = await passwordMatch(user, password)
    assert(!match)
  })
})
