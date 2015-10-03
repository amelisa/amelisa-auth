function routeChangeEmail(req) {
  let userId = req.session.userId;

  return new Promise((resolve, reject) => {
    this
      .parseChangeEmailRequest(req)
      .then(({data, info}) => {
        if (info) return resolve({info});

        let {email} = data;
        return this.changeEmail(userId, email);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeChangeEmail;
