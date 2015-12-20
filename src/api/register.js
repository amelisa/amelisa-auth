async function register (userId, email, password, userData = {}) {
  email = email.toLowerCase()

  let user = await this.getUserByEmail(email)
  if (user) return {info: 'User exist'}
  let { hash, salt } = await this.hash(password)

  let profile = {
    hash
  }
  if (salt) profile.salt = salt

  userData.email = email

  return this.registerProvider(userId, 'local', profile, userData)
}

export default register
