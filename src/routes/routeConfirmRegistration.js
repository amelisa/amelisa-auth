function routeConfirmRegistration (req) {
  return Promise
    .resolve(this.parseConfirmEmailRequest(req))
    .then((userId) => {
      return this
        .sendRegistrationConfirmationComplete(userId)
        .then(() => this.confirmEmail(userId))
        .then(() => this.login(userId, req))
    })
}

export default routeConfirmRegistration
