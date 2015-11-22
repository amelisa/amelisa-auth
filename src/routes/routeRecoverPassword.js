function routeRecoverPassword (req) {
  return Promise
    .resolve(this.parseRecoverPasswordRequest(req))
    .then(({data, info}) => {
      if (info) return {info}

      let { email } = data
      return this
        .resetPasswordSecret(email)
        .then(({userId, email, secret}) => {
          return this.sendRecoveryConfirmation(userId, email, secret)
        })
    })
}

export default routeRecoverPassword
