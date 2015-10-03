function resetPasswordSecret(email) {
  let model = this.store.createModel();

  return this
    .getUserByEmail(email)
    .then((user) => {
      let secret = model.id();

      return model
        .set(['auths', user._id, 'local.secret'], secret)
        .then(() => {
          return {userId: user._id, email, secret};
        });
    });
}

export default resetPasswordSecret;
