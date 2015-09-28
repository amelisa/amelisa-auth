import assert from 'assert';
import util from '../util';
import { default as changePasswordInit } from '../../lib/api/changePassword';

let auth;
let changePassword;
let model;
let userId;
let oldpassword;
let password;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a
      changePassword = changePasswordInit.bind(auth);
      done();
    });
});

describe('changePassword', () => {
  beforeEach((done) => {
    model = auth.store.createModel();
    userId = model.id();
    oldpassword = util.generatePassword();
    password = util.generatePassword();
    done();
  });

  it('should changePassword', (done) => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(oldpassword)
      }
    }
    model.add('auths', user, (err) => {
      assert(!err);

      changePassword(userId, oldpassword, password)
        .then((data) => {
          assert(!data);
          model.fetch('auths', userId, (err) => {
            assert(!err);
            let hash = model.get('auths', userId, 'local.hash');
            assert(hash);
            assert(util.compare(password, hash));
            done();
          });
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not changePassword if no local provider', (done) => {
    let user = {
      _id: userId
    }
    model.add('auths', user, (err) => {
      assert(!err);

      changePassword(userId, oldpassword, password)
        .then((data) => {
          assert(data && data.info);
          done();
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not changePassword if wrong oldpassword', (done) => {
    let user = {
      _id: userId,
      local: {
        hash: util.makeHash(oldpassword)
      }
    }
    oldpassword = util.generatePassword();

    model.add('auths', user, (err) => {
      assert(!err);

      changePassword(userId, oldpassword, password)
        .then((data) => {
          assert(data && data.info);
          done();
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not changePassword if no user', (done) => {
    changePassword(userId, password)
      .then((data) => {
        assert(data && data.info);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
