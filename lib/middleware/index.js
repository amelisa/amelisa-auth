import routesMiddleware from './routesMiddleware';
import sessionMiddleware from './sessionMiddleware';
import Auth from '../Auth';
import defaultOptions from '../defaultOptions';

Auth.prototype.routesMiddleware = routesMiddleware;
Auth.prototype.sessionMiddleware = sessionMiddleware;

function middleware(store, options = {}) {
  this.store = store;
  this.options = Object.assign({}, defaultOptions, options);

  for (let key in this.options.hooks) {
    this[key] = this.options.hooks[key];
  }

  this.initCrypt();

  return (req, res, next) => {
    this._passport.initialize()(req, res, (err) => {
      if (err) return next(err);
      this._passport.session()(req, res, (err) => {
        if (err) return next(err);
        this.sessionMiddleware(req, res, (err) => {
          if (err) return next(err);
          this.routesMiddleware(req, res, next);
        });
      });
    });
  }
}

Auth.prototype.middleware = middleware;
