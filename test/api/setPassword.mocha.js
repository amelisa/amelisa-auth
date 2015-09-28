import assert from 'assert';
import util from '../util';
import { default as setPasswordInit } from '../../lib/api/setPassword';

let auth;
let setPassword;
let model;
let userId;
let password;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a
      setPassword = setPasswordInit.bind(auth);
      done();
    });
});

describe('setPassword', () => {
  beforeEach((done) => {
    model = auth.store.createModel();
    userId = model.id();
    password = util.generatePassword();
    done();
  });

  it('should setPassword', (done) => {
    let user = {
      _id: userId
    }
    model.add('auths', user, (err) => {
      assert(!err);

      setPassword(userId, password)
        .then((data) => {
          assert(!data);
          model.fetch('auths', userId, (err) => {
            assert(!err);
            let hash = model.get('auths', userId, 'local.hash');
            assert(hash);
            let salt = model.get('auths', userId, 'local.salt');
            assert(!salt);
            done();
          });
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not setPassword if no user', (done) => {
    setPassword(userId, password)
      .then((data) => {
        assert(data && data.info);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
