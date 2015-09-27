function routeLogin(req, res) {
  return new Promise((resolve, reject) => {
    this
      .parseLoginRequest(req)
      .then(({data, info}) => {
        if (info) return resolve({info});

        let {email, password} = data;
        return this.authenticate(email, password);
      })
      .then((userId) => {
        if (!userId) return resolve({info: 'Wrong credentials'});

        return this.login(userId, req);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default routeLogin;
