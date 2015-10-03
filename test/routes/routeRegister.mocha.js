import assert from 'assert';
import util from '../util';
import { default as routeRegisterInit } from '../../lib/routes/routeRegister';

let auth;
let routeRegister;
let req;
let email;
let password;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      routeRegister = routeRegisterInit.bind(auth);
      done();
    });
});

describe('routeRegister', () => {
  beforeEach((done) => {
    let model = auth.store.createModel();
    email = util.generateEmail();
    password = util.generatePassword();
    userId = model.id();
    req = {
      body: {
        email,
        password,
        confirm: password
      },
      session: {
        userId
      },
      login: (userId, next) => next()
    }
    done();
  });

  it('should register and login', (done) => {
    routeRegister(req)
      .then((data) => {
        assert(!data);
        assert.equal(req.session.userId, userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
