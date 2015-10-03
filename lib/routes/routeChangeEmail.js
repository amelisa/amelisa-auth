function routeChangeEmail(req) {
  let userId = req.session.userId;
  return this
    .parseChangeEmailRequest(req)
    .then(({data, info}) => {
      if (info) return Promise.resolve({info});

      let {email} = data;
      return this
        .changeEmail(userId, email);
    });
}

export default routeChangeEmail;
