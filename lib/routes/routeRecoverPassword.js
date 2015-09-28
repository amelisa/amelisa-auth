function routeRecoverPassword(req) {
  return new Promise((resolve, reject) => {
    this
      .parseRecoverPasswordRequest(req)
      .then((emai) => {
        return this.resetPasswordSecret(email);
      })
      .then(({data}) => {
        let { userId, email, secret } = data;
        return this.sendRecoveryConfirmation(userId, email, secret);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeRecoverPassword;
