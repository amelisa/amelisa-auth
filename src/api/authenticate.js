async function authenticate (email, password) {
  email = email.toLowerCase()

  let user = await this.getUserByEmail(email)
  if (!user) return

  let match = await this.passwordMatch(user, password)
  if (!match) return

  return {userId: user.id}
}

export default authenticate
