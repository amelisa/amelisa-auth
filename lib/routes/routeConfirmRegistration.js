function routeConfirmRegistration(req) {
  let userId = req.session.userId;
  return new Promise((resolve, reject) => {
    this
      .parseConfirmEmailRequest(req)
      .then((userId) => {
        return this.sendRegistrationConfirmationComplete(userId);
      })
      .then(() => {
        return this.confirmEmail(userId);
      })
      .then(() => {
        return this.login(userId, req);
      })
      .then(resovle)
      .catch(reject);
  });
}

export default routeConfirmRegistration;
