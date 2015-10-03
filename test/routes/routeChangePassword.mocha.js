import assert from 'assert';
import util from '../util';
import { default as routeChangePasswordInit } from '../../lib/routes/routeChangePassword';

let auth;
let routeChangePassword;
let req;
let email;
let password;
let newpassword;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      routeChangePassword = routeChangePasswordInit.bind(auth);
      done();
    });
});

describe('routeChangePassword', () => {
  beforeEach((done) => {
    let model = auth.store.createModel();
    email = util.generateEmail();
    password = util.generatePassword();
    newpassword = util.generatePassword();
    let user = {
      email: email,
      local: {
        hash: util.makeHash(password)
      }
    }
    userId = model.add('auths', user, done);
    req = {
      body: {
        oldpassword: password,
        password: newpassword,
        confirm: newpassword
      },
      session: {
        userId
      }
    }
  });

  it('should change password', (done) => {
    routeChangePassword(req)
      .then((data) => {
        assert(!data);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
