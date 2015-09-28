function changePassword(userId, oldpassword, password) {
  let model = this.store.createModel();

  return new Promise((resolve, reject) => {
    model.fetch('auths', userId, (err) => {
      if (err) return reject(err);

      let user = model.get('auths', userId);

      if (!user) return resolve({info: 'No user'});

      if (!user.local) return resolve({info: 'No local provider'});

      this
        .passwordMatch(user, oldpassword)
        .then((match) => {
          if (!match) return resolve({info: 'Wrong old password'});

          return this.setPassword(userId, password);
        })
        .then(resolve)
        .catch(reject);
    });
  });
}

export default changePassword;
