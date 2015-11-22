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

  it('should logout', () => {
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

        return util
          .getUserIdFromSession(res, memoryStore)
          .then((id) => {
            assert.equal(id, userId)

            request
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

                let cookie = util.getCookie(res)
                assert(!cookie)
              })
          })
      })
  })
})
