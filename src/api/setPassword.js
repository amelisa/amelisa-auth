async function setPassword (userId, password) {
  let model = this.store.createModel()
  let $user = model.doc('auths', userId)

  await $user.fetch()

  let user = $user.get()
  if (!user) return {info: 'No user'}
  let { hash, salt } = await this.hash(password)

  await $user.set('local.hash', hash)
  if (!salt) return

  await $user.set('local.salt', salt)
}

export default setPassword
