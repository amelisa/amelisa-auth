const expirationTimeout = 12 * 60 * 1000 * 1000

async function confirmEmail (userId) {
  let model = this.store.createModel()
  let $user = model.doc('auths', userId)

  await $user.fetch()

  let user = $user.get()
  if (!user) return {info: 'No user'}
  if (!user.local) return {info: 'No local provider'}

  let emailConfirm = user.local.emailConfirm
  if (!emailConfirm) return {info: 'Already confirm'}

  if (emailConfirm.date + expirationTimeout < Date.now()) return {info: 'Confirmation expired'}

  await $user.set('email', emailConfirm.email)
  await $user.del('local.emailConfirm')
}

export default confirmEmail
