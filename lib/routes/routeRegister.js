function routeRegister(req, res, done) {
  let userId = req.session.userId;
  return new Promise((resolve, reject) => {
    this
      .parseRegisterRequest(req)
      .then(({data, info}) => {
        if (info) return resolve({info});

        let {email, password, userData} = data;
        return this.register(userId, email, password, userData);
      })
      .then((userId) => {
        return this.login(userId, req);
      })
      .then(() => {
        resolve({userId});
      })
      .catch(reject);
  });
}

export default routeRegister;
