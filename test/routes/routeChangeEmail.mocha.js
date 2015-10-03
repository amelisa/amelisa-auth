import assert from 'assert';
import util from '../util';
import { default as routeChangeEmailInit } from '../../lib/routes/routeChangeEmail';

let auth;
let routeChangeEmail;
let req;
let email;
let password;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      routeChangeEmail = routeChangeEmailInit.bind(auth);
      done();
    });
});

describe('routeChangeEmail', () => {
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
    req = {
      body: {
        email: 'new@email.com'
      },
      session: {
        userId
      }
    }
  });

  it('should change email', (done) => {
    routeChangeEmail(req)
      .then((data) => {
        assert(!data);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
