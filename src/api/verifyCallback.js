async function verifyCallback (req, accessToken, refreshToken, profile, done) {
  let model = req.getModel()

  let $users = model.query('auths', {[`${profile.provider}.id`]: profile.id})

  try {
    await $users.fetch()
  } catch (err) {
    return done(err)
  }

  let users = $users.get()
  let user = users[0]

  // If there is user, no need to register new one. Return to router to login
  if (user) return done(null, user.id)

  // Maybe we need these tokens someday
  profile.accessToken = accessToken
  profile.refreshToken = refreshToken

  // Register new user or add provider to current user
  let { userId } = req.session

  // Generate userId if absent
  if (!userId) userId = model.id()

  try {
    await this.registerProvider(userId, profile.provider, profile)
  } catch (err) {
    return done(err)
  }

  done(null, userId)
}

export default verifyCallback
