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

describe('Middleware change email', () => {
  beforeEach(() => {
    return util
      .getRequest()
      .then((r) => {
        request = r
        auth = request.app.auth
        email = util.generateEmail()
        newemail = util.generateEmail()
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

  it('should change email', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(!info)
        assert(success)
        assert(url)

        return request
          .get(path)
          .send({email: newemail})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body
            assert(!info)
            assert(success)

            let model = auth.store.createModel()
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId)
                assert.equal(user.email, newemail)
              })
          })
      })
  })

  it('should not change email when no email', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(!info)
        assert(success)
        assert(url)

        return request
          .get(path)
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body
            assert(info)
            assert(!success)

            let model = auth.store.createModel()
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId)
                assert.equal(user.email, email)
              })
          })
      })
  })

  it('should not change email when same email', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body
        assert(!info)
        assert(success)
        assert(url)

        return request
          .get(path)
          .send({email})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body
            assert(info)
            assert(!success)

            let model = auth.store.createModel()
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId)
                assert.equal(user.email, email)
              })
          })
      })
  })

  it('should not change email when not loggedIn', () => {
    return request
      .get(path)
      .send({email: newemail})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, info} = res.body
        assert(info)
        assert(!success)

        let model = auth.store.createModel()
        return model
          .fetch('auths', userId)
          .then(() => {
            let user = model.get('auths', userId)
            assert.equal(user.email, email)
          })
      })
  })
})
