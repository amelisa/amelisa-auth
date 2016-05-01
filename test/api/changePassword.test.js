import assert from 'assert'
import util from '../util'
import { default as changePasswordInit } from '../../src/api/changePassword'

let auth
let changePassword
let model
let userId
let oldpassword
let password

before(async () => {
  auth = await util.getAuth()
  changePassword = changePasswordInit.bind(auth)
})

describe('changePassword', async () => {
  beforeEach(() => {
    model = auth.store.createModel()
    userId = model.id()
    oldpassword = util.generatePassword()
    password = util.generatePassword()
  })

  it('should changePassword', async () => {
    let user = {
      id: userId,
      local: {
        hash: util.makeHash(oldpassword)
      }
    }
    await model.add('auths', user)
    let data = await changePassword(userId, oldpassword, password)
    assert(!data)

    await model.fetch('auths', userId)
    let hash = model.get('auths', userId, 'local.hash')
    assert(hash)
    assert(util.compare(password, hash))
  })

  it('should not changePassword if no local provider', async () => {
    let user = {
      id: userId
    }
    await model.add('auths', user)
    let data = await changePassword(userId, oldpassword, password)
    assert(data && data.info)
  })

  it('should not changePassword if wrong oldpassword', async () => {
    let user = {
      id: userId,
      local: {
        hash: util.makeHash(oldpassword)
      }
    }
    oldpassword = util.generatePassword()
    await model.add('auths', user)
    let data = await changePassword(userId, oldpassword, password)
    assert(data && data.info)
  })

  it('should not changePassword if no user', async () => {
    let data = await changePassword(userId, password)
    assert(data && data.info)
  })
})
