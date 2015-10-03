function routeResetPassword(req) {
  return this
    .parseResetPasswordRequest(req)
    .then(({data, info}) => {
      if (info) return Promise.resolve({info});

      let {password, secret} = data;
      return this
        .sendResetPassword(secret, password)
        .then(() => this.resetPassword(secret, password));
    });
}

export default routeResetPassword;
