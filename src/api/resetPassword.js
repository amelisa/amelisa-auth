function resetPassword (secret, password) {
  return this
    .getUserBySecret(secret)
    .then(({data, info}) => {
      if (info) return {info}

      let {user} = data
      return this.setPassword(user._id, password)
    })
}

export default resetPassword
