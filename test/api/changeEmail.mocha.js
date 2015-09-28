import assert from 'assert';
import util from '../util';
import { default as changeEmailInit } from '../../lib/api/changeEmail';

let auth;
let changeEmail;
let model;
let userId;
let email;

before((done) => {
  util.getAuth()
    .then((a) => {
      auth = a
      changeEmail = changeEmailInit.bind(auth);
      done();
    });
});

describe('changeEmail', () => {
  beforeEach((done) => {
    model = auth.store.createModel();
    userId = model.id();
    email = util.generateEmail();
    done();
  });

  it('should changeEmail', (done) => {
    let user = {
      _id: userId,
      email: util.generateEmail()
    }
    model.add('auths', user, (err) => {
      assert(!err);

      changeEmail(userId, email)
        .then((data) => {
          assert(!data);
          model.fetch('auths', userId, (err) => {
            assert(!err);
            assert.equal(model.get('auths', userId, 'email'), email);
            done();
          });
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not changeEmail if same email', (done) => {
    let user = {
      _id: userId,
      email: email
    }
    model.add('auths', user, (err) => {
      assert(!err);

      changeEmail(userId, email)
        .then((data) => {
          assert(data && data.info);
          done();
        })
        .catch((err) => {
          done('catch is called ' + err);
        });
    });
  });

  it('should not changeEmail if no user', (done) => {
    changeEmail(userId, email)
      .then((data) => {
        assert(data && data.info);
        done();
      })
      .catch((err) => {
        done('catch is called ' + err);
      });
  });
});
