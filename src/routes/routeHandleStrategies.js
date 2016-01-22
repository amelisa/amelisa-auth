async function routeHandleStrategies (req, res, parsedUrl) {
  let provider = parsedUrl.method
  let strategy = this.options.strategies[provider]

  // Return error if no provider
  if (!strategy) return {info: `Unknown auth provider: ${provider}`}

  let strategyOptions = strategy.conf || {}
  let passportOptions = this.options.passport

  let saveQuery = () => {
    let name = this.options.queryCookieField

    try {
      res.cookie(name, JSON.stringify(req.query || {}))
    } catch (e) {}
  }

  let restoreQuery = () => {
    let name = this.options.queryCookieField
    let cookies = req.cookies || {}
    let query = cookies[name]

    try {
      query = JSON.parse(query)
    } catch (e) {
      query = {}
    }

    for (let key in query) {
      req.query[key] = req.query[key] || query[key]
    }

    res.clearCookie(name)
  }

  return new Promise((resolve, reject) => {
    if (parsedUrl.callback !== 'callback') {
      saveQuery()

      // User tries to login with provider, he will be redirected to provider's page
      this._passport.authenticate(provider, strategyOptions)(req, res, (err) => {
        // Here we can get access error from provider
        if (err) return reject(err)
      })
    } else { // Callback
      restoreQuery()

      // User is redirected here from provider's page
      this._passport.authenticate(provider, passportOptions, (err, userId) => {
        // Auth failed, return error
        if (err) return reject(err)

        // Everything is ok, login user
        this
          .login(userId, req)
          .then(resolve)
          .catch(reject)
      })(req, res, () => {})
    }
  })
}

export default routeHandleStrategies
