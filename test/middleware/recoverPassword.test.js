import assert from 'assert'
import util from '../util'

const path = '/auth/recoverpassword'

let request
let auth
let email
let password
let userId

describe('Middleware recover password', () => {
  beforeEach(() => {
    return util
      .getRequest()
      .then((r) => {
        request = r
        auth = request.app.auth
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

  it('should recover password and set secret', () => {
    return request
      .get(path)
      .send({email})
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
            assert(user.local.secret)
          })
      })
  })
})
