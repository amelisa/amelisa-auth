import assert from 'assert';
import util from '../util';
import { default as passwordMatchInit } from '../../lib/api/passwordMatch';

let auth;
let passwordMatch;
let model;
let userId;
let password;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a
      passwordMatch = passwordMatchInit.bind(auth);
      done();
    });
});

describe('passwordMatch', () => {
  beforeEach((done) => {
    model = auth.store.createModel();
    userId = model.id();
    password = util.generatePassword();
    done();
  });

  it('should passwordMatch', (done) => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(password)
      }
    }

    passwordMatch(user, password)
      .then((match) => {
        assert(match);
        done()
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });

  it('should not passwordMatch', (done) => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(password)
      }
    }
    password = util.generatePassword();

    passwordMatch(user, password)
      .then((match) => {
        assert(!match);
        done()
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
