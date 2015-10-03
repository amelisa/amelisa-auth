import assert from 'assert';
import util from '../util';

const path = '/auth/logout';
const loginPath = '/auth/login';

let request;
let auth;
let memoryStore;
let email;
let password;
let userId;

describe('Middleware logout', () => {
  beforeEach((done) => {
    util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        memoryStore = request.app.memoryStore;
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

  it('should logout', (done) => {
    request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        util.getUserIdFromSession(res, memoryStore, (err, id) => {
          assert(!err);
          assert.equal(id, userId);

          request
            .get(path)
            .send({email, password})
            .set('X-Requested-With', 'XMLHttpRequest')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              assert.equal(err, undefined);
              let {success, url, info} = res.body;
              assert(!info);
              assert(success);
              assert(url);

              let cookie = util.getCookie(res);
              assert(!cookie);
              done();
            });
        });
      });
  });
});
