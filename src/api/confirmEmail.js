const expirationTimeout = 12 * 60 * 1000 * 1000

async function confirmEmail (userId) {
  let model = this.store.createModel()
  let $user = model.doc('auths', userId)

  await $user.fetch()

  let user = $user.get()
  if (!user) return {info: 'No user'}
  if (!user.local) return {info: 'No local provider'}

  let emailChange = user.local.emailChange
  if (!emailChange) return {info: 'Already confirm'}

  let now = Date.now()
  if (emailChange.date + expirationTimeout < now) return {info: 'Confirmation expired'}

  await $user.set('email', emailChange.email)
  await $user.del('local.emailChange')
}

export default confirmEmail
