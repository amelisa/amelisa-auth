function setPassword (userId, password) {
  let model = this.store.createModel()
  let userDoc = model.doc('auths', userId)

  return userDoc
    .fetch()
    .then(() => {
      let user = userDoc.get()

      if (!user) return {info: 'No user'}

      return this
        .hash(password)
        .then(({hash, salt}) => {
          return userDoc
            .set('local.hash', hash)
            .then(() => {
              if (!salt) return

              return userDoc.set('local.salt', salt)
            })
        })
    })
}

export default setPassword
