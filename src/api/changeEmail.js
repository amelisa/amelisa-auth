async function changeEmail (userId, email) {
  email = email.toLowerCase()
  let model = this.store.createModel()
  let $user = model.doc('auths', userId)

  await $user.fetch()

  let user = $user.get()
  if (!user) return {info: 'No user'}
  if (user.email === email) return {info: 'Same email'}

  await $user.set('email', email)
}

export default changeEmail
