import assert from 'assert';
import util from '../util';
import { default as routeLoginInit } from '../../lib/routes/routeLogin';

let auth;
let routeLogin;
let req;
let email;
let password;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      routeLogin = routeLoginInit.bind(auth);
      done();
    });
});

describe('routeLogin', () => {
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
      session: {},
      login: (userId, next) => next()
    }
  });

  it('should login', (done) => {
    routeLogin(req)
      .then((data) => {
        assert(!data);
        assert.equal(req.session.userId, userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should not login when no email', (done) => {
    delete req.body.email;
    routeLogin(req)
      .then((data) => {
        assert(data && data.info);
        assert(!req.session.userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
