import assert from 'assert';
import util from '../util';
import { default as loginInit } from '../../lib/api/login';

let auth;
let login;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a
      login = loginInit.bind(auth);
      done();
    });
});

describe.skip('login', () => {
  it('should set req.user and req.session.userId', (done) => {
    let req = {
      session: {}
    };
    login(dbUser._id, req)
      .then(() => {
        assert(req.user);
        assert.equal(req.user, dbUser._id);
        assert(req.session.userId);
        assert.equal(req.session.userId, dbUser._id);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
