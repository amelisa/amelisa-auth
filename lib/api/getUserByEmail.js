function getUserByEmail(email) {
  let model = this.store.createModel();

  email = email.toLowerCase();

  return new Promise((resolve, reject) => {
    model.fetch('auths', {email: email}, (err) => {
      if (err) return reject(err);

      let users = model.getQuery('auths', {email: email});
      let user = users[0];

      if (!user) {
        return resolve();
      }

      return resolve(user);
    });
  });
}

export default getUserByEmail;
