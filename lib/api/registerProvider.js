function registerProvider(userId, provider, profile, userData = {}) {
  let model = this.store.createModel();

  profile.date = Date.now();

  return new Promise((resolve, reject) => {
    model.fetch('auths', userId, (err) => {
      if (err) return reject(err);

      let user = model.get('auths', userId);

      if (user) {
        if (user[provider]) return resolve({info: 'Provider ' + provider + ' for user ' + userId + ' allready exists'});

        return model.set('auths', userId, provider, profile, (err) => {
          if (err) return reject(err);

          resolve();
        });
      }

      user = userData;
      user._id = userId;
      user[provider] = profile;

      model.add('auths', user, (err) => {
        if (err) return reject(err);

        resolve();
      });
    });
  });
}

export default registerProvider;
