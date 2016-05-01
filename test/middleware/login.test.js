import assert from 'assert'
import util from '../util'

const path = '/auth/login'
let request
let auth
let memoryStore
let email
let password
let userId

describe('Middleware login', () => {
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

  it('should login', async () => {
    let res = await request
      .get(path)
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
  })

  it('should not login when no credentials', async () => {
    let res = await request
      .get(path)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.notEqual(id, userId)
  })

  it('should not login when no email', async () => {
    let res = await request
      .get(path)
      .send({password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.notEqual(id, userId)
  })

  it('should not login when no password', async () => {
    let res = await request
      .get(path)
      .send({email})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.notEqual(id, userId)
  })

  it('should not login when email is wrong', async () => {
    let res = await request
      .get(path)
      .send({email: 'wrong@email.com', password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.notEqual(id, userId)
  })

  it('should not login when password is wrong', async () => {
    let res = await request
      .get(path)
      .send({email, password: 'wrongpassword'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.notEqual(id, userId)
  })
})
