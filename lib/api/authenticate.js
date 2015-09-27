function authenticate(email, password) {
  email = email.toLowerCase();
  let userId;

  return new Promise((resolve, reject) => {
    this
      .getUserByEmail(email)
      .then((user) => {
        if (!user) return resolve();

        userId = user._id;
        return this.passwordMatch(user, password);
      })
      .then((match) => {
        if (!match) return resolve();

        resolve(userId);
      })
      .catch(reject);
  });
}

export default authenticate;
