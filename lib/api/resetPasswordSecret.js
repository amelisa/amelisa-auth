function resetPasswordSecret(email) {
  let model = this.store.createModel();

  return new Promise((resolve, reject) => {
    this
      .getUserByEmail(email)
      .then((user) => {
        let secret = model.id();

        model.set('auths', user._id, 'local.secret', secret, (err) => {
          if (err) return reject(err);

          resolve({userId: user._id, email, secret});
        });
      })
      .catch(reject);
  });
}

export default resetPasswordSecret;
