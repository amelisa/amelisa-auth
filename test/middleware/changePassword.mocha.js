import assert from 'assert';
import util from '../util';

const path = '/auth/changepassword';
const loginPath = '/auth/login';

let request;
let auth;
let email;
let password;
let newpassword;
let userId;

describe('Middleware change password', () => {
  beforeEach(() => {
    return util
      .getRequest()
      .then((r) => {
        request = r;
        auth = request.app.auth;
        email = util.generateEmail();
        password = util.generatePassword();
        newpassword = util.generatePassword();
        let model = auth.store.createModel();
        userId = model.id();

        let user = {
          _id: userId,
          email: email,
          local: {
            hash: util.makeHash(password)
          }
        }
        return model.add('auths', user);
      });
  });

  it('should change password', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .send({oldpassword: password, password: newpassword, confirm: newpassword})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(!info);
            assert(success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(newpassword, user.local.hash));
              });
          });
      });
  });

  it('should not change password when no passwords', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(password, user.local.hash));
              });
          });
      });
  });

  it('should not change password when no oldpassword', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .send({password: newpassword, confirm: newpassword})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(password, user.local.hash));
              });
          });
      });
  });

  it('should not change password when no password', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .send({oldpassword: password, confirm: newpassword})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(password, user.local.hash));
              });
          });
      });
  });

  it('should not change password when no confirm', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .send({oldpassword: password, password: newpassword})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(password, user.local.hash));
              });
          });
      });
  });

  it('should not change password when wrong oldpassword', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .send({oldpassword: 'wrongpassword', password: newpassword, confirm: newpassword})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(password, user.local.hash));
              });
          });
      });
  });

  it('should not change password when wrong confirm', () => {
    return request
      .get(loginPath)
      .send({email, password})
      .set('X-Requested-With', 'XMLHttpRequest')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        let {success, url, info} = res.body;
        assert(!info);
        assert(success);
        assert(url);

        return request
          .get(path)
          .send({oldpassword: password, password: newpassword, confirm: 'wrongpassword'})
          .set('Cookie', util.getCookie(res))
          .set('X-Requested-With', 'XMLHttpRequest')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            let {success, info} = res.body;
            assert(info);
            assert(!success);

            let model = auth.store.createModel();
            return model
              .fetch('auths', userId)
              .then(() => {
                let user = model.get('auths', userId);
                assert(util.compare(password, user.local.hash));
              });
          });
      });
  });
});
