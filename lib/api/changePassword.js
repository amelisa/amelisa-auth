function changePassword(userId, oldpassword, password) {
  let model = this.store.createModel();
  let userDoc = model.doc('auths', userId);

  return userDoc
    .fetch()
    .then(() => {
      let user = userDoc.get();

      if (!user) return Promise.resolve({info: 'No user'});

      if (!user.local) return Promise.resolve({info: 'No local provider'});

      return this
        .passwordMatch(user, oldpassword)
        .then((match) => {
          if (!match) return Promise.resolve({info: 'Wrong old password'});

          return this.setPassword(userId, password);
        });
    });
}

export default changePassword;
