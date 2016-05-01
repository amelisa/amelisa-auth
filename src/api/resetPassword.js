async function resetPassword (secret, password) {
  let { data, info } = await this.getUserBySecret(secret)
  if (info) return {info}
  let { user } = data

  await this.setPassword(user.id, password)
}

export default resetPassword
