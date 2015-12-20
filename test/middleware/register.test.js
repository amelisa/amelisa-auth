import assert from 'assert'
import util from '../util'

const path = '/auth/register'
let request
let auth
let memoryStore
let email
let password

describe('Middleware register', () => {
  beforeEach(async () => {
    request = await util.getRequest()
    auth = request.app.auth
    memoryStore = request.app.memoryStore
    email = util.generateEmail()
    password = util.generatePassword()
  })

  it('should register', async () => {
    let res = await request
      .get(path)
      .send({email, password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(!info)
    assert(success)
    assert(url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 1)
    let user = users[0]
    assert.equal(user.email, email)
    assert(util.compare(password, user.local.hash))

    let id = await util.getUserIdFromSession(res, memoryStore)
    assert.equal(id, user._id)
  })

  it('should not register when no credentials', async () => {
    let res = await request
      .get(path)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })

  it('should not register when no email', async () => {
    let res = await request
      .get(path)
      .send({password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })

  it('should not register when no password', async () => {
    let res = await request
      .get(path)
      .send({email, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })

  it('should not register when no confirm', async () => {
    let res = await request
      .get(path)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })

  it('should not register when email format wrong', async () => {
    let res = await request
      .get(path)
      .send({email: 'wrongformat', password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })

  it('should not register when password length < 6', async () => {
    password = 'asdf'
    let res = await request
      .get(path)
      .send({email, password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })

  it('should not register when password isnt confirm', async () => {
    let res = await request
      .get(path)
      .send({email, password, confirm: password + 'diff'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, url, info } = res.body
    assert(info)
    assert(!success)
    assert(!url)

    let model = auth.store.createModel()
    let userQuery = model.query('auths', {})
    await userQuery.fetch()
    let users = userQuery.get()
    assert.equal(users.length, 0)
  })
})
