import assert from 'assert'
import util from '../util'

const path = '/auth/changepassword'
const loginPath = '/auth/login'

let request
let auth
let email
let password
let newpassword
let userId

describe('Middleware change password', () => {
  beforeEach(async () => {
    request = await util.getRequest()
    auth = request.app.auth
    email = util.generateEmail()
    password = util.generatePassword()
    newpassword = util.generatePassword()
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

  it('should change password', async () => {
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
      .send({oldpassword: password, password: newpassword, confirm: newpassword})
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
    assert(util.compare(newpassword, user.local.hash))
  })

  it('should not change password when no passwords', async () => {
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
    assert(util.compare(password, user.local.hash))
  })

  it('should not change password when no oldpassword', async () => {
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
      .send({password: newpassword, confirm: newpassword})
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
    assert(util.compare(password, user.local.hash))
  })

  it('should not change password when no password', async () => {
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
      .send({oldpassword: password, confirm: newpassword})
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
    assert(util.compare(password, user.local.hash))
  })

  it('should not change password when no confirm', async () => {
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
      .send({oldpassword: password, password: newpassword})
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
    assert(util.compare(password, user.local.hash))
  })

  it('should not change password when wrong oldpassword', async () => {
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
      .send({oldpassword: 'wrongpassword', password: newpassword, confirm: newpassword})
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
    assert(util.compare(password, user.local.hash))
  })

  it('should not change password when wrong confirm', async () => {
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
      .send({oldpassword: password, password: newpassword, confirm: 'wrongpassword'})
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
    assert(util.compare(password, user.local.hash))
  })
})
