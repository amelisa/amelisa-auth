function sessionMiddleware(req, res, next) {
  let model = req.getModel();

  let userId = req.session.userId;

  let done = () => {
    // Put userId to session and model
    model.set('_auth', 'session', 'userId', userId);

    var isAuthenticated = req.isAuthenticated();

    // _auth.session.loggedIn is the main way to distinguish auth and not auth states
    if (isAuthenticated) model.set('_auth', 'session', 'loggedIn', true);

    // Request hook
    this
      .request(req, res, userId, isAuthenticated)
      .then(next)
      .catch((err) => {
        console.error(err, err.stack);
        res.status(500).end('Internal error');
      });
  }

  if (!userId) {
    userId = req.session.userId = model.id();
    return done();
  }

  model.fetch('auths', userId, (err) => {
    if (err) return next(err);

    let user = model.get('auths', userId);

    if (!user && req.isAuthenticated()) {
      // This happens when user was deleted from database, but his session not
      this.logout(req);
    }

    done();
  });
}

export default sessionMiddleware;
