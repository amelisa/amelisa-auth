function setPassword (userId, password) {
  let model = this.store.createModel()
  let userDoc = model.doc('auths', userId)

  return userDoc
    .fetch()
    .then(() => {
      let user = userDoc.get()

      if (!user) return Promise.resolve({info: 'No user'})

      return this
        .hash(password)
        .then(({hash, salt}) => {
          return userDoc
            .set('local.hash', hash)
            .then(() => {
              if (!salt) return Promise.resolve()

              return userDoc.set('local.salt', salt)
            })
        })
    })
}

export default setPassword
