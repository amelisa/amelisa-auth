function routeRegister (req) {
  let userId = req.session.userId

  return Promise
    .resolve(this.parseRegisterRequest(req))
    .then(({data, info}) => {
      if (info) return {info}

      let {email, password, userData} = data
      return this
        .register(userId, email, password, userData)
        .then(() => this.login(userId, req))
    })
}

export default routeRegister
