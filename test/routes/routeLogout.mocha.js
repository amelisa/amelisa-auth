import assert from 'assert';
import util from '../util';
import { default as routeLogoutInit } from '../../lib/routes/routeLogout';

let auth;
let routeLogout;
let req;
let email;
let password;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      routeLogout = routeLogoutInit.bind(auth);
      done();
    });
});

describe('routeLogout', () => {
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
        email,
        password
      },
      session: {
        userId
      },
      logout: () => {}
    }
  });

  it('should logout', (done) => {
    routeLogout(req)
      .then((data) => {
        assert(!data);
        assert(!req.session.userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
