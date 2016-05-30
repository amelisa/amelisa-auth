import assert from 'assert'
import util from '../util'
import { default as resetPasswordInit } from '../../src/api/resetPassword'

let auth
let resetPassword
let model
let userId
let secret
let password

before(async () => {
  auth = await util.getAuth()
  resetPassword = resetPasswordInit.bind(auth)
})

describe('resetPassword', async () => {
  beforeEach(() => {
    model = auth.store.createModel()
    userId = model.id()
    secret = model.id()
    password = util.generatePassword()
  })

  it('should resetPassword', async () => {
    let user = {
      id: userId,
      local: {
        secret
      }
    }
    await model.add('auths', user)
    let data = await resetPassword(secret, password)
    assert(!data)

    await model.fetch('auths', userId)
    let hash = model.get('auths', userId, 'local.hash')
    assert(hash)
    assert(util.compare(password, hash))
  })

  it('should not resetPassword if no local provider', async () => {
    let user = {
      id: userId
    }
    await model.add('auths', user)
    let data = await resetPassword(secret, password)
    assert(data && data.info)
  })

  it('should not resetPassword if wrong secret', async () => {
    let user = {
      id: userId,
      local: {
        secret: 'wrong'
      }
    }
    await model.add('auths', user)
    let data = await resetPassword(secret, password)
    assert(data && data.info)
  })

  it('should not resetPassword if no user', async () => {
    let data = await resetPassword(userId, password)
    assert(data && data.info)
  })
})
