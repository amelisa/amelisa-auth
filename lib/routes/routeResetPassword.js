function routeResetPassword (req) {
  return Promise
    .resolve(this.parseResetPasswordRequest(req))
    .then(({data, info}) => {
      if (info) return {info}

      let {password, secret} = data
      return this
        .sendResetPassword(secret, password)
        .then(() => this.resetPassword(secret, password))
    })
}

export default routeResetPassword
