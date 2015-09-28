function parseUrl(req) {
  let parts = req.path.slice(1).split('/');

  return {
    base: parts[0],
    method: parts[1],
    callback: parts[2]
  }
}

function route(urls, parsedUrl, req, res) {
  switch (parsedUrl.method) {
    // Catch /auth/:method
    case urls.changeemail: return this.routeChangeEmail(req, res);
    case urls.changepassword: return this.routeChangePassword(req, res);
    case urls.recoverpassword: return this.routeRecoverPassword(req, res);
    case urls.resetpassword: return this.routeResetPassword(req, res);
    case urls.login: return this.routeLogin(req, res);
    case urls.logout: return this.routeLogout(req, res);
    case urls.register: return this.routeRegister(req, res);
    case urls.confirmregistration: return this.routeConfirmRegistration(req, res);
    case urls.confirmemailchange: return this.routeConfirmEmailChange(req, res);
    // Catch /auth/:provider and /auth/:provider/callback routes
    default:
      req.isProvider = true;
      return this.routeHandleStrategies(req, res, parsedUrl);
  }
}

function routesMiddleware(req, res, next) {
  let urls = this.options.urls;

  let parsedUrl = parseUrl(req);

  if (parsedUrl.base !== urls.base) return next();

  route
    .call(this, urls, parsedUrl, req, res)
    .then((data) => {
      let info = data ? data.info : null;
      if (info) return res.json({info});
      if (req.isProvider) return next();
      this.response(null, info, parsedUrl.method, req, res);
    })
    .catch((err) => {
      console.error(err, err.stack)
      res.status(500).end('Internal error');
    });
}

export default routesMiddleware;
