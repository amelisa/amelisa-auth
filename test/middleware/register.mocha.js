import assert from 'assert';
import util from '../util';

const path = '/auth/register';
let request;
let auth;
let memoryStore;
let email;
let password;
let userId;

describe('Middleware register', () => {
  beforeEach((done) => {
    util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        memoryStore = request.app.memoryStore;
        email = util.generateEmail();
        password = util.generatePassword();
        done();
      });
  });

  it('should register', (done) => {
    request
      .get(path)
      .send({email, password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 1);
          let user = users[0];
          assert.equal(user.email, email);
          assert(util.compare(password, user.local.hash));

          util.getUserIdFromSession(res, memoryStore, (err, id) => {
            assert(!err);
            assert.equal(id, user._id);
            done();
          });
        });
      });
  });

  it('should not register when no credentials', (done) => {
    request
      .get(path)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });

  it('should not register when no email', (done) => {
    request
      .get(path)
      .send({password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });

  it('should not register when no password', (done) => {
    request
      .get(path)
      .send({email, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });

  it('should not register when no confirm', (done) => {
    request
      .get(path)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });

  it('should not register when email format wrong', (done) => {
    request
      .get(path)
      .send({email: 'wrongformat', password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });

  it('should not register when password length < 6', (done) => {
    password = 'asdf';
    request
      .get(path)
      .send({email, password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });

  it('should not register when password isnt confirm', (done) => {
    request
      .get(path)
      .send({email, password, confirm: password + 'diff'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        model.fetch('auths', {}, () => {
          let users = model.query('auths', {}).get();
          assert.equal(users.length, 0);
          done();
        });
      });
  });
});
