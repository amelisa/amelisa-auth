async function changeEmail (userId, email) {
  email = email.toLowerCase()
  let model = this.store.createModel()
  let userDoc = model.doc('auths', userId)

  await userDoc.fetch()

  let user = userDoc.get()
  if (!user) return {info: 'No user'}
  if (user.email === email) return {info: 'Same email'}

  await userDoc.set('email', email)
}

export default changeEmail
