function routeChangeEmail(req) {
  return new Promise((resolve, reject) => {
    this
      .parseChangeEmailRequest(req)
      .then((email) => {
        return this.changeEmail(req.session.userId, email);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeChangeEmail;
