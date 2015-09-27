function request(req, res, userId, isAuthenticated) {
  // Request hook executes on every request before it goes to app, it's good place
  // to restrict access to some urls

  if (isAuthenticated) {
    if (!req.session.loggedIn) req.session.loggedIn = true;
  } else {
    delete req.session.loggedIn;
  }

  return Promise.resolve();
}

export default request;
