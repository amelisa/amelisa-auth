import assert from 'assert';
import util from '../util';
import { default as changeEmailInit } from '../../lib/api/changeEmail';

let auth;
let changeEmail;
let model;
let userId;
let email;

before(() => {
  return util.getAuth()
    .then((a) => {
      auth = a
      changeEmail = changeEmailInit.bind(auth);
    });
});

describe('changeEmail', () => {
  beforeEach(() => {
    model = auth.store.createModel();
    userId = model.id();
    email = util.generateEmail();
  });

  it('should changeEmail', () => {
    let user = {
      _id: userId,
      email: util.generateEmail()
    }
    return model
      .add('auths', user)
      .then(() => {
        return changeEmail(userId, email)
          .then((data) => {
            assert(!data);
            return model
              .fetch('auths', userId)
              .then(() => {
                assert.equal(model.get('auths', userId, 'email'), email);
              });
            });
      });
  });

  it('should not changeEmail if same email', () => {
    let user = {
      _id: userId,
      email: email
    }
    return model
      .add('auths', user)
      .then(() => {
        return changeEmail(userId, email)
          .then((data) => {
            assert(data && data.info);
          });
      });
  });

  it('should not changeEmail if no user', () => {
    return changeEmail(userId, email)
      .then((data) => {
        assert(data && data.info);
      });
  });
});
