async function passwordMatch (user, password) {
  let { hash, salt } = user.local

  return this.compare(password, hash, salt)
}

export default passwordMatch
