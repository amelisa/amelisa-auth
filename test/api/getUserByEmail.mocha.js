import assert from 'assert';
import util from '../util';
import { default as getUserByEmailInit } from '../../lib/api/getUserByEmail';

let auth;
let getUserByEmail;
let email;
let userId;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a;
      getUserByEmail = getUserByEmailInit.bind(auth);
      done();
    });
});

describe('getUserByEmail', () => {
  beforeEach((done) => {
    let model = auth.store.createModel();
    email = util.generateEmail();
    let user = {
      email: email
    }
    userId = model.add('auths', user, done);
  });

  it('should get user', (done) => {
    getUserByEmail(email)
      .then((user) => {
        assert(user);
        assert.equal(user._id, userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should get user when uppercase email', (done) => {
    getUserByEmail(email.toUpperCase())
      .then((user) => {
        assert(user);
        assert.equal(user._id, userId);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should not get user when wrong email', (done) => {
    getUserByEmail('wrong@email.com')
      .then((user) => {
        assert(!user);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
