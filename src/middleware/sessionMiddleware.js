function sessionMiddleware (req, res, next) {
  let model = req.getModel()
  let userId = req.session.userId
  let isAuthenticated = req.isAuthenticated()

  let done = () => {
    // Put userId to session and model
    model.set('_session.userId', userId)

    // _session.loggedIn is the main way to distinguish auth and not auth states
    model.set('_session.loggedIn', isAuthenticated)

    // Request hook
    this
      .request(req, res, userId, isAuthenticated)
      .then(next)
      .catch((err) => {
        console.error(err, err.stack)
        res.status(500).end('Internal error')
      })
  }

  if (!userId) {
    userId = req.session.userId = model.id()
    return done()
  }

  let $user = model.doc('auths', userId)

  $user
    .fetch()
    .then(() => {
      let user = $user.get()

      if (!user && isAuthenticated) {
        // This happens when user was deleted from database, but his session not
        this.logout(req)
      }

      done()
    })
    .catch((err) => {
      console.error(err, err.stack)
      res.status(500).end('Internal error')
    })
}

export default sessionMiddleware
