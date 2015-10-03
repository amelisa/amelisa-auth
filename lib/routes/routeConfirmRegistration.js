function routeConfirmRegistration(req) {
  let userId = req.session.userId;

  return this
    .parseConfirmEmailRequest(req)
    .then((userId) => {
      return this
        .sendRegistrationConfirmationComplete(userId)
        .then(() => this.confirmEmail(userId))
        .then(() => this.login(userId, req));
    });
}

export default routeConfirmRegistration;
