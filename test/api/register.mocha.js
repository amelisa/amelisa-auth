import assert from 'assert';
import util from '../util';
import { default as registerInit } from '../../lib/api/register';

let auth;
let register;
let model;
let userId;
let email;
let password;
let userData;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a
      register = registerInit.bind(auth);
      done();
    });
});

describe('register', () => {
  beforeEach((done) => {
    model = auth.store.createModel();
    userId = model.id();
    email = util.generateEmail();
    password = util.generatePassword();
    userData = {
      a: 'b'
    }
    done();
  });

  it('should register and create user', (done) => {
    register(userId, email, password, userData)
      .then((data) => {
        assert(!data);
        model.fetch('auths', userId, (err) => {
          assert(!err);
          let user = model.get('auths', userId);
          assert(user);
          assert.equal(user._id, userId);
          assert.equal(user.email, email);
          assert.equal(user.a, userData.a);
          assert(user.local);
          assert(user.local.hash);
          assert(util.compare(password, user.local.hash));
          done();
        });
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should just save profile if user with userId exists but without provider', (done) => {
    let dbUser = {
      _id: userId,
    }
    model.add('auths', dbUser, (err) => {
      assert(!err);
      register(userId, email, password, userData)
        .then((data) => {
          assert(!data);
          model.fetch('auths', userId, (err) => {
            assert(!err);
            let user = model.get('auths', userId);
            assert(user);
            assert.equal(user._id, userId);
            assert(!user.email);
            assert(!user.a);
            assert(user.local);
            assert(user.local.hash);
            assert(util.compare(password, user.local.hash));
            done();
          });
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not register when user with same email exists', (done) => {
    let dbUser = {
      email: email
    }
    model.add('auths', dbUser, (err) => {
      assert(!err);
      register(userId, email, password, userData)
        .then((data) => {
          assert(data && data.info);
          done();
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not register when user with same userId and provider exists', (done) => {
    let dbUser = {
      _id: userId,
      local: {}
    }
    model.add('auths', dbUser, (err) => {
      assert(!err);
      register(userId, email, password, userData)
        .then((data) => {
          assert(data && data.info);
          done();
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });
});
