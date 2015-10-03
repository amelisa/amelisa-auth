import assert from 'assert';
import util from '../util';
import { default as changePasswordInit } from '../../lib/api/changePassword';

let auth;
let changePassword;
let model;
let userId;
let oldpassword;
let password;

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      changePassword = changePasswordInit.bind(auth);
    });
});

describe('changePassword', () => {
  beforeEach(() => {
    model = auth.store.createModel();
    userId = model.id();
    oldpassword = util.generatePassword();
    password = util.generatePassword();
  });

  it('should changePassword', () => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(oldpassword)
      }
    }
    return model
      .add('auths', user)
      .then(() => {
        return changePassword(userId, oldpassword, password)
          .then((data) => {
            assert(!data);
            return model
              .fetch('auths', userId)
              .then(() => {
                let hash = model.get('auths', userId, 'local.hash');
                assert(hash);
                assert(util.compare(password, hash));
              });
          });
      });
  });

  it('should not changePassword if no local provider', () => {
    let user = {
      _id: userId
    }
    return model
      .add('auths', user)
      .then(() => {
        changePassword(userId, oldpassword, password)
          .then((data) => {
            assert(data && data.info);
          });
      });
  });

  it('should not changePassword if wrong oldpassword', () => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(oldpassword)
      }
    }
    oldpassword = util.generatePassword();

    return model
      .add('auths', user)
      .then(() => {
        changePassword(userId, oldpassword, password)
          .then((data) => {
            assert(data && data.info);
          });
      });
  });

  it('should not changePassword if no user', () => {
    return changePassword(userId, password)
      .then((data) => {
        assert(data && data.info);
      });
  });
});
