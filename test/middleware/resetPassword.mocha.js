import assert from 'assert';
import util from '../util';

const path = '/auth/resetpassword';

let request;
let auth;
let email;
let password;
let newpassword;
let secret;
let userId;

describe('Middleware reset password', () => {
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
        secret = model.id();

        let user = {
          email: email,
          local: {
            hash: util.makeHash(password),
            secret: secret
          }
        }
        userId = model.add('auths', user, done);
      });
  });

  it('should reset password', (done) => {
    request
      .get(path)
      .send({secret, password: newpassword, confirm: newpassword})
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

  it('should not reset password when no credentials', (done) => {
    request
      .get(path)
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

  it('should not reset password when no secret', (done) => {
    request
      .get(path)
      .send({password: newpassword, confirm: newpassword})
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

  it('should not reset password when no password', (done) => {
    request
      .get(path)
      .send({secret, confirm: newpassword})
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

  it('should not reset password when no confirm', (done) => {
    request
      .get(path)
      .send({secret, password: newpassword})
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

  it('should not reset password when secret is wrong', (done) => {
    request
      .get(path)
      .send({secret: 'wrongsecret', password: newpassword, confirm: newpassword})
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

  it('should not reset password when confirm is wrong', (done) => {
    request
      .get(path)
      .send({secret, password: newpassword, confirm: 'wrongpassword'})
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
