async function getUserBySecret (secret) {
  let model = this.store.createModel()
  let $users = model.query('auths', {'local.secret': secret})

  await $users.fetch()

  let users = $users.get()
  let user = users[0]

  if (!user) return {info: 'No user'}

  return {data: {user}}
}

export default getUserBySecret
