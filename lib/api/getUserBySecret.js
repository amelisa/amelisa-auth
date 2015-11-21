function getUserBySecret (secret) {
  let model = this.store.createModel()
  let userQuery = model.query('auths', {'local.secret': secret})

  return userQuery
    .fetch()
    .then(() => {
      let users = userQuery.get()
      let user = users[0]

      if (!user) return Promise.resolve({info: 'No user'})

      return Promise.resolve({data: {user}})
    })
}

export default getUserBySecret
