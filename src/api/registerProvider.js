async function registerProvider (userId, provider, profile, userData = {}) {
  let model = this.store.createModel()
  let $user = model.doc('auths', userId)

  profile.date = Date.now()

  await $user.fetch()

  let user = $user.get()

  if (user) {
    if (user[provider]) {
      return {
        info: `Provider ${provider} for user ${userId} allready exists`
      }
    }

    return await $user.set(provider, profile)
  }

  user = userData
  user.id = userId
  user[provider] = profile

  await model.add('auths', user)
}

export default registerProvider
