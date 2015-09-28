function routeChangePassword(req) {
  let userId = req.session.userId;
  return new Promise((resolve, reject) => {
    this
      .parseChangePasswordRequest(req)
      .then(({data}) => {
        let { oldpassword, password } = data;
        return this.changePassword(userId, oldpassword, password);
      })
      .then(({info}) => {
        return this.sendChangePassword(userId, password);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeChangePassword;
