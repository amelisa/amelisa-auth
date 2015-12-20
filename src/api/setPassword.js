async function setPassword (userId, password) {
  let model = this.store.createModel()
  let userDoc = model.doc('auths', userId)

  await userDoc.fetch()

  let user = userDoc.get()
  if (!user) return {info: 'No user'}
  let { hash, salt } = await this.hash(password)

  await userDoc.set('local.hash', hash)
  if (!salt) return

  await userDoc.set('local.salt', salt)
}

export default setPassword
