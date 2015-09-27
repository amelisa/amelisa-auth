import assert from 'assert';
import util from '../util';
import { default as authenticateInit } from '../../lib/api/authenticate';

let auth;
let authenticate;
let email;
let password;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      authenticate = authenticateInit.bind(auth);
      done();
    });
});

describe('authenticate', () => {
  beforeEach((done) => {
    let model = auth.store.createModel();
    email = util.generateEmail();
    password = util.generatePassword();
    let user = {
      email: email,
      local: {
        hash: util.makeHash(password)
      }
    }
    userId = model.add('auths', user, done);
  });

  it('should authenticate and return userId', (done) => {
    authenticate(email, password)
      .then((id) => {
        assert(id);
        assert.equal(id, userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should authenticate and return userId with uppercase email', (done) => {
    authenticate(email.toUpperCase(), password)
      .then((id) => {
        assert(id);
        assert.equal(id, userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should not authenticate with wrong email', (done) => {
    authenticate('wrong@email.com', password)
      .then((userId) => {
        assert(!userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should not authenticate with wrong password', (done) => {
    authenticate(email, 'wrongpassword')
      .then((userId) => {
        assert(!userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should not authenticate with uppercase password', (done) => {
    authenticate(email, password.toUpperCase())
      .then((userId) => {
        assert(!userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
