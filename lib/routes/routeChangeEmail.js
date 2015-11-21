function routeChangeEmail (req) {
  let userId = req.session.userId

  return Promise
    .resolve(this.parseChangeEmailRequest(req))
    .then(({data, info}) => {
      if (info) return {info}

      let {email} = data
      return this
        .changeEmail(userId, email)
    })
}

export default routeChangeEmail
