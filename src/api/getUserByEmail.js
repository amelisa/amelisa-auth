async function getUserByEmail (email) {
  email = email.toLowerCase()
  let model = this.store.createModel()
  let $users = model.query('auths', {email})

  await $users.fetch()

  let users = $users.get()
  let user = users[0]

  return user
}

export default getUserByEmail
