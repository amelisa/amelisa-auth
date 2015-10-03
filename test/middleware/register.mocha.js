import assert from 'assert';
import util from '../util';

const path = '/auth/register';
let request;
let auth;
let memoryStore;
let email;
let password;
let userId;

describe('Middleware register', () => {
  beforeEach(() => {
    return util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        memoryStore = request.app.memoryStore;
        email = util.generateEmail();
        password = util.generatePassword();
      });
  });

  it('should register', () => {
    return request
      .get(path)
      .send({email, password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 1);
            let user = users[0];
            assert.equal(user.email, email);
            assert(util.compare(password, user.local.hash));

            return util
              .getUserIdFromSession(res, memoryStore)
              .then((id) => {
                assert.equal(id, user._id);
              });
          });
      });
  });

  it('should not register when no credentials', () => {
    return request
      .get(path)
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });

  it('should not register when no email', () => {
    return request
      .get(path)
      .send({password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });

  it('should not register when no password', () => {
    return request
      .get(path)
      .send({email, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });

  it('should not register when no confirm', () => {
    return request
      .get(path)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });

  it('should not register when email format wrong', () => {
    return request
      .get(path)
      .send({email: 'wrongformat', password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });

  it('should not register when password length < 6', () => {
    password = 'asdf';
    return request
      .get(path)
      .send({email, password, confirm: password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });

  it('should not register when password isnt confirm', () => {
    return request
      .get(path)
      .send({email, password, confirm: password + 'diff'})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(info);
        assert(!success);
        assert(!url);

        let model = auth.store.createModel();
        let userQuery = model.query('auths', {});
        return userQuery
          .fetch()
          .then(() => {
            let users = userQuery.get();
            assert.equal(users.length, 0);
          });
      });
  });
});
