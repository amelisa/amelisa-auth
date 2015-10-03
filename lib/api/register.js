function register(userId, email, password, userData = {}) {
  email = email.toLowerCase();

  return this
    .getUserByEmail(email)
    .then((user) => {
      if (user) return Promise.resolve({info: 'User exist'});

      return this
        .hash(password)
        .then(({hash, salt}) => {
          let profile = {
            hash: hash
          }
          if (salt) profile.salt = salt;

          userData.email = email;

          return this.registerProvider(userId, 'local', profile, userData);
        });
    });
}

export default register;
