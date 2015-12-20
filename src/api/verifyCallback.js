async function verifyCallback (req, accessToken, refreshToken, profile) {
  let model = req.getModel()

  await model.fetch('auths', {[profile.provider]: profile.id})

  let users = model.getQuery('auths', {[profile.provider]: profile.id})
  let user = users[0]

  // If there is user, no need to register new one. Return to router to login
  if (user) return user._id

  // Maybe we need these tokens someday
  profile.accessToken = accessToken
  profile.refreshToken = refreshToken

  // Register new user or add provider to current user
  await this.registerProvider(req.session.userId, profile.provider, profile, null)
}

export default verifyCallback
