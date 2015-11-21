function routeRegister (req) {
  let userId = req.session.userId

  return this
    .parseRegisterRequest(req)
    .then(({data, info}) => {
      if (info) return Promise.resolve({info})

      let {email, password, userData} = data
      return this
        .register(userId, email, password, userData)
        .then(() => this.login(userId, req))
    })
}

export default routeRegister
