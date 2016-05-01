async function resetPasswordSecret (email) {
  let model = this.store.createModel()
  let user = await this.getUserByEmail(email)
  let secret = model.id()

  await model.set(['auths', user.id, 'local.secret'], secret)

  return {userId: user.id, secret}
}

export default resetPasswordSecret
