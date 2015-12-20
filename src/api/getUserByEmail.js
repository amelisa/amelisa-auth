async function getUserByEmail (email) {
  email = email.toLowerCase()
  let model = this.store.createModel()
  let userQuery = model.query('auths', {email})

  await userQuery.fetch()

  let users = userQuery.get()
  let user = users[0]

  return user
}

export default getUserByEmail
