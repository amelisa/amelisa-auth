function register(userId, email, password, userData = {}) {
  email = email.toLowerCase();

  return new Promise((resolve, reject) => {
    this
      .getUserByEmail(email)
      .then((user) => {
        if (user) return resolve({info: 'User exist'});

        return this.hash(password);
      })
      .then(({hash, salt}) => {
        let profile = {
          hash: hash
        }
        if (salt) profile.salt = salt;

        userData.email = email;

        return this.registerProvider(userId, 'local', profile, userData);
      })
      .then(resolve)
      .catch(reject);
  });
}

export default register;
