import assert from 'assert';
import util from '../util';

const path = '/auth/recoverpassword';

let request;
let auth;
let email;
let password;
let userId;

describe('Middleware recover password', () => {
  beforeEach((done) => {
    util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        email = util.generateEmail();
        password = util.generatePassword();
        let model = auth.store.createModel();

        let user = {
          email: email,
          local: {
            hash: util.makeHash(password)
          }
        }
        userId = model.add('auths', user, done);
      });
  });

  it('should recover password and set secret', (done) => {
    request
      .get(path)
      .send({email})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, info} = res.body;
        assert(!info);
        assert(success);

        let model = auth.store.createModel();
        model.fetch('auths', userId, () => {
          let user = model.get('auths', userId);
          assert(user.local.secret);
          done();
        });
      });
    });
});
