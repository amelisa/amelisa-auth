async function resetPasswordSecret (email) {
  let model = this.store.createModel()
  let user = await this.getUserByEmail(email)
  let secret = model.id()

  await model.set(['auths', user._id, 'local.secret'], secret)

  return {userId: user._id, secret}
}

export default resetPasswordSecret
