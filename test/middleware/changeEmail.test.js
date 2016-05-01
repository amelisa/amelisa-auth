import assert from 'assert'
import util from '../util'

const path = '/auth/changeemail'
const loginPath = '/auth/login'

let request
let auth
let email
let newemail
let password
let userId

describe('Middleware change email', async () => {
  beforeEach(async () => {
    request = await util.getRequest()
    auth = request.app.auth
    email = util.generateEmail()
    newemail = util.generateEmail()
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

  it('should change email', async () => {
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

    res = await request
      .get(path)
      .send({email: newemail})
      .set('Cookie', util.getCookie(res))
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    success = res.body.success
    info = res.body.info
    assert(!info)
    assert(success)

    let model = auth.store.createModel()
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert.equal(user.email, newemail)
  })

  it('should not change email when no email', async () => {
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

    res = await request
      .get(path)
      .set('Cookie', util.getCookie(res))
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    success = res.body.success
    info = res.body.info
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert.equal(user.email, email)
  })

  it('should not change email when same email', async () => {
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

    res = await request
      .get(path)
      .send({email})
      .set('Cookie', util.getCookie(res))
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    success = res.body.success
    info = res.body.info
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert.equal(user.email, email)
  })

  it('should not change email when not loggedIn', async () => {
    let res = await request
      .get(path)
      .send({email: newemail})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    await model.fetch('auths', userId)
    let user = model.get('auths', userId)
    assert.equal(user.email, email)
  })
})
