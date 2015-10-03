import assert from 'assert';
import util from '../util';

const path = '/auth/changepassword';
const loginPath = '/auth/login';

let request;
let auth;
let email;
let password;
let newpassword;
let userId;

describe('Middleware change password', () => {
  beforeEach((done) => {
    util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        email = util.generateEmail();
        password = util.generatePassword();
        newpassword = util.generatePassword();
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

  it('should change password', (done) => {
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
          .send({oldpassword: password, password: newpassword, confirm: newpassword})
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
              assert(util.compare(newpassword, user.local.hash));
              done();
            });
          });
        });
  });

  it('should not change password when no passwords', (done) => {
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
              assert(util.compare(password, user.local.hash));
              done();
            });
          });
        });
  });

  it('should not change password when no oldpassword', (done) => {
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
          .send({password: newpassword, confirm: newpassword})
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
              assert(util.compare(password, user.local.hash));
              done();
            });
          });
        });
  });

  it('should not change password when no password', (done) => {
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
          .send({oldpassword: password, confirm: newpassword})
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
              assert(util.compare(password, user.local.hash));
              done();
            });
          });
        });
  });

  it('should not change password when no confirm', (done) => {
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
          .send({oldpassword: password, password: newpassword})
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
              assert(util.compare(password, user.local.hash));
              done();
            });
          });
        });
  });

  it('should not change password when wrong oldpassword', (done) => {
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
          .send({oldpassword: 'wrongpassword', password: newpassword, confirm: newpassword})
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
              assert(util.compare(password, user.local.hash));
              done();
            });
          });
        });
  });

  it('should not change password when wrong confirm', (done) => {
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
          .send({oldpassword: password, password: newpassword, confirm: 'wrongpassword'})
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
              assert(util.compare(password, user.local.hash));
              done();
            });
          });
        });
  });
});
