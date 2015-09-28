function getUserBySecret(secret) {
  let model = this.store.createModel();

  return new Promise((resolve, reject) => {
    model.fetch('auths', {'local.secret': secret}, (err) => {
      if (err) return reject(err);

      let users = model.getQuery('auths', {'local.secret': secret});
      let user = users[0];

      if (!user) return resolve({info: 'No user'});

      resolve(user);
    });
  });
}

export default getUserBySecret;
