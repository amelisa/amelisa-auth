function routeResetPassword(req) {
  return new Promise((resolve, reject) => {
    this
      .parseResetPasswordRequest(req)
      .then(({data}) => {
        let { secret, password } = data;
        return this.sendResetPassword(secret, password);
      })
      .then(() => {
        return this.resetPassword(secret, password);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeResetPassword;
