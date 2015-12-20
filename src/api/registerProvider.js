async function registerProvider (userId, provider, profile, userData = {}) {
  let model = this.store.createModel()
  let userDoc = model.doc('auths', userId)

  profile.date = Date.now()

  await userDoc.fetch()

  let user = userDoc.get()

  if (user) {
    if (user[provider]) {
      return {
        info: `Provider ${provider} for user ${userId} allready exists`
      }
    }

    return await userDoc.set(provider, profile)
  }

  user = userData
  user._id = userId
  user[provider] = profile

  await model.add('auths', user)
}

export default registerProvider
