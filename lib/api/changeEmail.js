function changeEmail(userId, email) {
  let model = this.store.createModel();

  email = email.toLowerCase();

  return new Promise((resolve, reject) => {
    model.fetch('auths', userId, (err) => {
      if (err) return reject(err);

      let user = model.get('auths', userId);

      if (!user) return resolve({info: 'No user'});

      if (user.email === email) return resolve({info: 'Same email'});

      model.set('auths', userId, 'email', email, (err) => {
        if (err) return reject();

        resolve();
      });
    });
  });
}

export default changeEmail;
