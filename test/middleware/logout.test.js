import assert from 'assert'
import util from '../util'

const path = '/auth/logout'
const loginPath = '/auth/login'

let request
let auth
let memoryStore
let email
let password
let userId

describe('Middleware logout', () => {
  beforeEach(async () => {
    request = await util.getRequest()
    auth = request.app.auth
    memoryStore = request.app.memoryStore
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

  it('should logout', async () => {
    let res = await request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(!info)
    assert(success)
    assert(url)

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.equal(id, userId)

    res = await request
      .get(path)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    success = res.body.success
    info = res.body.info
    url = res.body.url
    assert(!info)
    assert(success)
    assert(url)

    let cookie = util.getCookie(res)
    assert(!cookie)
  })
})
