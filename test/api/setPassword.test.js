import assert from 'assert'
import util from '../util'
import { default as setPasswordInit } from '../../src/api/setPassword'

let auth
let setPassword
let model
let userId
let password

before(async () => {
  auth = await util.getAuth()
  setPassword = setPasswordInit.bind(auth)
})

describe('setPassword', () => {
  beforeEach(async () => {
    model = auth.store.createModel()
    userId = model.id()
    password = util.generatePassword()
  })

  it('should setPassword', async () => {
    let user = {
      _id: userId
    }
    await model.add('auths', user)
    let data = await setPassword(userId, password)
    assert(!data)
    await model.fetch('auths', userId)
    let hash = model.get('auths', userId, 'local.hash')
    assert(hash)
    let salt = model.get('auths', userId, 'local.salt')
    assert(!salt)
  })

  it('should not setPassword if no user', async () => {
    let data = await setPassword(userId, password)
    assert(data && data.info)
  })
})
