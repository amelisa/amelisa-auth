function verifyCallback (req, accessToken, refreshToken, profile) {
  let model = req.getModel()

  return new Promise((resolve, reject) => {
    model.fetch('auths', {[profile.provider]: profile.id}, (err) => {
      if (err) return reject(err)

      let users = model.getQuery('auths', {[profile.provider]: profile.id})
      let user = users[0]

      // If there is user, no need to register new one. Return to router to login
      if (user) return resolve(user._id)

      // Maybe we need these tokens someday
      profile.accessToken = accessToken
      profile.refreshToken = refreshToken

      // Register new user or add provider to current user
      this
        .registerProvider(req.session.userId, profile.provider, profile, null)
        .then(resolve)
        .catch(reject)
    })
  })
}

export default verifyCallback
