import assert from 'assert';
import util from '../util';

const url = '/auth/logout';
let request;
let auth;
let email;
let password;
let userId;


describe('Middleware logout', () => {
  beforeEach((done) => {
    util
      .getRequest()
      .then((r) => {
        request = r;
        done();
      });
  });

  it('should logout', (done) => {
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
});
