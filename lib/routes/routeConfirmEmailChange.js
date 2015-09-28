function routeConfirmEmailChange(req) {
  return new Promise((resolve, reject) => {
    this
      .parseConfirmEmailRequest(req)
      .then((userId) => {
        return this.confirmEmail(userId);
      })
      .then(() => {
        return this.login(userId, req);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeConfirmEmailChange;
