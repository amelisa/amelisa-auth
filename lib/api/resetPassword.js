function resetPassword(secret, password) {
  return new Promise((resolve, reject) => {
    this
      .getUserBySecret(secret)
      .then((user) => {
        return this.setPassword(user, password);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default resetPassword;
