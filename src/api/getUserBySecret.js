async function getUserBySecret (secret) {
  let model = this.store.createModel()
  let userQuery = model.query('auths', {'local.secret': secret})

  await userQuery.fetch()

  let users = userQuery.get()
  let user = users[0]

  if (!user) return {info: 'No user'}

  return {data: {user}}
}

export default getUserBySecret
