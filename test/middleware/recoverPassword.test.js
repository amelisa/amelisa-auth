import assert from 'assert'
import util from '../util'

const path = '/auth/recoverpassword'

let request
let auth
let email
let password
let userId

describe('Middleware recover password', () => {
  beforeEach(async () => {
    request = await util.getRequest()
    auth = request.app.auth
    email = util.generateEmail()
    password = util.generatePassword()
    let model = auth.store.createModel()
    userId = model.id()

    let user = {
      id: userId,
      email: email,
      local: {
        hash: util.makeHash(password)
      }
    }
    await model.add('auths', user)
  })

  it('should recover password and set secret', async () => {
    let res = await request
      .get(path)
      .send({email})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(!info)
    assert(success)

    let model = auth.store.createModel()
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert(user.local.secret)
  })
})
