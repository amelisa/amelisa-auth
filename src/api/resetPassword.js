async function resetPassword (secret, password) {
  let { data, info } = await this.getUserBySecret(secret)
  if (info) return {info}
  let { user } = data

  let result = await this.setPassword(user.id, password)
  if (result) return result

  return {user}
}

export default resetPassword
