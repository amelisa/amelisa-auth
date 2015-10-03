function routeChangePassword(req) {
  let userId = req.session.userId;
  let newpassword;

  return new Promise((resolve, reject) => {
    this
      .parseChangePasswordRequest(req)
      .then(({data, info}) => {
        if (info) return resolve({info});

        let { oldpassword, password } = data;
        newpassword = password;
        return this.changePassword(userId, oldpassword, password);
      })
      .then((data) => {
        if (data && data.info) return resolve({info: data.info});

        return this.sendChangePassword(userId, newpassword);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeChangePassword;
