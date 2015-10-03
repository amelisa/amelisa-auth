import assert from 'assert';
import util from '../util';

const url = '/auth/login';
let request;
let auth;
let email;
let password;
let userId;


describe('Middleware login', () => {
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

  it('should login', (done) => {
    request
      .get(url)
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
        done();
      });
  });

  it('should not login when no credentials', (done) => {
    request
      .get(url)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);
        done();
      });
  });

  it('should not login when no email', (done) => {
    request
      .get(url)
      .send({password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);
        done();
      });
  });

  it('should not login when no password', (done) => {
    request
      .get(url)
      .send({email})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);
        done();
      });
  });

  it('should not login when email is wrong', (done) => {
    request
      .get(url)
      .send({email: 'wrong@email.com', password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);
        done();
      });
  });

  it('should not login when password is wrong', (done) => {
    request
      .get(url)
      .send({email, password: 'wrongpassword'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        assert.equal(err, undefined);
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);
        done();
      });
  });
});
