import assert from 'assert';
import util from '../util';

const url = '/auth/register';
let request;
let auth;
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
        email = util.generateEmail();
        password = util.generatePassword();
        done();
      });
  });

  it('should register', (done) => {
    request
      .get(url)
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
        done();
      });
  });

  it('should not register when no credentials', (done) => {
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
});
