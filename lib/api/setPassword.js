function setPassword(userId, password) {
  let model = this.store.createModel();

  return new Promise((resolve, reject) => {
    model.fetch('auths', userId, (err) => {
      if (err) return reject(err);

      let user = model.get('auths', userId);

      if (!user) return resolve({info: 'No user'});

      this
        .hash(password)
        .then(({hash, salt}) => {
          model.set('auths', userId, 'local.hash', hash, (err) => {
            if (err) return reject(err);

            if (!salt) return resolve();

            model.set('auths', userId, 'local.salt', salt, (err) => {
              if (err) return reject(err);

              resolve();
            });
          });
        })
        .catch(reject);
    });
  });
}

export default setPassword;
