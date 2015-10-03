import assert from 'assert';
import util from '../util';

const path = '/auth/changeemail';
const loginPath = '/auth/login';

let request;
let auth;
let email;
let newemail;
let password;
let userId;

describe('Middleware change email', () => {
  beforeEach((done) => {
    util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        email = util.generateEmail();
        newemail = util.generateEmail();
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

  it('should change email', (done) => {
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

        request
          .get(path)
          .send({email: newemail})
          .set('Cookie', util.getCookie(res))
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
              assert.equal(user.email, newemail);
              done();
            });
          });
        });
  });

  it('should not change email when no email', (done) => {
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

        request
          .get(path)
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            assert.equal(err, undefined);
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            model.fetch('auths', userId, () => {
              let user = model.get('auths', userId);
              assert.equal(user.email, email);
              done();
            });
          });
        });
  });

  it('should not change email when same email', (done) => {
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

        request
          .get(path)
          .send({email})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            assert.equal(err, undefined);
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            model.fetch('auths', userId, () => {
              let user = model.get('auths', userId);
              assert.equal(user.email, email);
              done();
            });
          });
        });
  });

  it('should not change email when not loggedIn', (done) => {
    request
      .get(path)
      .send({email: newemail})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, info} = res.body;
        assert(info);
        assert(!success);

        let model = auth.store.createModel();
        model.fetch('auths', userId, () => {
          let user = model.get('auths', userId);
          assert.equal(user.email, email);
          done();
        });
      });
    });
});
