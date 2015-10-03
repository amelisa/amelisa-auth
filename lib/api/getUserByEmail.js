function getUserByEmail(email) {
  email = email.toLowerCase();
  let model = this.store.createModel();
  let userQuery = model.query('auths', {email});

  return userQuery
    .fetch()
    .then(() => {
      let users = userQuery.get();
      let user = users[0];

      return Promise.resolve(user);
    });
}

export default getUserByEmail;
