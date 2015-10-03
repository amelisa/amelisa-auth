import assert from 'assert';
import util from '../util';
import { default as setPasswordInit } from '../../lib/api/setPassword';

let auth;
let setPassword;
let model;
let userId;
let password;

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      setPassword = setPasswordInit.bind(auth);
    });
});

describe('setPassword', () => {
  beforeEach(() => {
    model = auth.store.createModel();
    userId = model.id();
    password = util.generatePassword();
  });

  it('should setPassword', () => {
    let user = {
      _id: userId
    }
    return model
      .add('auths', user)
      .then(() => {
        setPassword(userId, password)
          .then((data) => {
            assert(!data);
            return model
              .fetch('auths', userId)
              .then(() => {
                let hash = model.get('auths', userId, 'local.hash');
                assert(hash);
                let salt = model.get('auths', userId, 'local.salt');
                assert(!salt);
              });
          });
      });
  });

  it('should not setPassword if no user', () => {
    return setPassword(userId, password)
      .then((data) => {
        assert(data && data.info);
      });
  });
});
