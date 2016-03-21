import assert from 'assert'
import util from '../util'

const path = '/auth/resetpassword'

let request
let auth
let email
let password
let newpassword
let secret
let userId

describe('Middleware reset password', () => {
  beforeEach(async () => {
    request = await util.getRequest()
    auth = request.app.auth
    email = util.generateEmail()
    password = util.generatePassword()
    newpassword = util.generatePassword()
    let model = auth.store.createModel()
    userId = model.id()
    secret = model.id()

    let user = {
      _id: userId,
      email: email,
      local: {
        hash: util.makeHash(password),
        secret: secret
      }
    }
    await model.add('auths', user)
  })

  it('should reset password', async () => {
    let res = await request
      .get(path)
      .send({secret, password: newpassword, confirm: newpassword})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(!info)
    assert(success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(newpassword, user.local.hash))
  })

  it('should not reset password when no credentials', async () => {
    let res = await request
      .get(path)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(password, user.local.hash))
  })

  it('should not reset password when no secret', async () => {
    let res = await request
      .get(path)
      .send({password: newpassword, confirm: newpassword})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(password, user.local.hash))
  })

  it('should not reset password when no password', async () => {
    let res = await request
      .get(path)
      .send({secret, confirm: newpassword})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(password, user.local.hash))
  })

  it('should not reset password when no confirm', async () => {
    let res = await request
      .get(path)
      .send({secret, password: newpassword})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(password, user.local.hash))
  })

  it('should not reset password when secret is wrong', async () => {
    let res = await request
      .get(path)
      .send({secret: 'wrongsecret', password: newpassword, confirm: newpassword})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(password, user.local.hash))
  })

  it('should not reset password when confirm is wrong', async () => {
    let res = await request
      .get(path)
      .send({secret, password: newpassword, confirm: 'wrongpassword'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)

    let { success, info } = res.body
    assert(info)
    assert(!success)

    let model = auth.store.createModel()
    let $user = model.doc('auths', userId)
    await $user.fetch()
    let user = $user.get()
    assert(util.compare(password, user.local.hash))
  })
})
