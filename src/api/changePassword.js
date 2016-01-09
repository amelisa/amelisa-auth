async function changePassword (userId, oldpassword, password) {
  let model = this.store.createModel()
  let $user = model.doc('auths', userId)

  await $user.fetch()

  let user = $user.get()
  if (!user) return {info: 'No user'}
  if (!user.local) return {info: 'No local provider'}

  let match = await this.passwordMatch(user, oldpassword)
  if (!match) return {info: 'Wrong old password'}

  await this.setPassword(userId, password)
}

export default changePassword
