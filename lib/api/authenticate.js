function authenticate(email, password) {
  email = email.toLowerCase();

  return this
    .getUserByEmail(email)
    .then((user) => {
      if (!user) return Promise.resolve();

      return this
        .passwordMatch(user, password)
        .then((match) => {
          if (!match) return Promise.resolve();

          return Promise.resolve(user._id);
        });
      });
}

export default authenticate;
