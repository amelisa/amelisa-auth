function resetPasswordSecret(email) {
  let model = this.store.createModel();

  return new Promise((resolve, reject) => {
    this
      .getUserByEmail(email)
      .then((user) => {
        let secret = model.id();

        model.set('auths', user._id, 'local.secret', secret, (err) => {
          if (err) return reject(err);

          resolve({secret, userId: user._id});
        });
      })
      .catch(reject);
  });
}

export default resetPasswordSecret;
