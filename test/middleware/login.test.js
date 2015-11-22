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
  beforeEach(() => {
    return util
      .getRequest()
      .then((r) => {
        request = r
        auth = request.app.auth
        memoryStore = request.app.memoryStore
        email = util.generateEmail()
        password = util.generatePassword()
        let model = auth.store.createModel()
        userId = model.id()

        let user = {
          _id: userId,
          email: email,
          local: {
            hash: util.makeHash(password)
          }
        }
        return model.add('auths', user)
      })
  })

  it('should login', () => {
    return request
      .get(path)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(!info)
        assert(success)
        assert(url)

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.equal(id, userId)
          })
      })
  })

  it('should not login when no credentials', () => {
    return request
      .get(path)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(info)
        assert(!success)
        assert(!url)

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.notEqual(id, userId)
          })
      })
  })

  it('should not login when no email', () => {
    request
      .get(path)
      .send({password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(info)
        assert(!success)
        assert(!url)

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.notEqual(id, userId)
          })
      })
  })

  it('should not login when no password', () => {
    request
      .get(path)
      .send({email})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(info)
        assert(!success)
        assert(!url)

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.notEqual(id, userId)
          })
      })
  })

  it('should not login when email is wrong', () => {
    request
      .get(path)
      .send({email: 'wrong@email.com', password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(info)
        assert(!success)
        assert(!url)

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.notEqual(id, userId)
          })
      })
  })

  it('should not login when password is wrong', () => {
    request
      .get(path)
      .send({email, password: 'wrongpassword'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(info)
        assert(!success)
        assert(!url)

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.notEqual(id, userId)
          })
      })
  })
})
