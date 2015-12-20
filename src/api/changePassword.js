async function changePassword (userId, oldpassword, password) {
  let model = this.store.createModel()
  let userDoc = model.doc('auths', userId)

  await userDoc.fetch()

  let user = userDoc.get()
  if (!user) return {info: 'No user'}
  if (!user.local) return {info: 'No local provider'}

  let match = await this.passwordMatch(user, oldpassword)
  if (!match) return {info: 'Wrong old password'}

  await this.setPassword(userId, password)
}

export default changePassword
