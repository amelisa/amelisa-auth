function routeRecoverPassword (req) {
  return this
    .parseRecoverPasswordRequest(req)
    .then(({data, info}) => {
      if (info) return Promise.resolve({info})

      let { email } = data
      return this
        .resetPasswordSecret(email)
        .then(({userId, email, secret}) => {
          return this.sendRecoveryConfirmation(userId, email, secret)
        })
    })
}

export default routeRecoverPassword
