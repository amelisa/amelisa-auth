function routeLogin (req) {
  return Promise
    .resolve(this.parseLoginRequest(req))
    .then(({data, info}) => {
      if (info) return Promise.resolve({info})

      let {email, password} = data
      return this
        .authenticate(email, password)
        .then((userId) => {
          if (!userId) return Promise.resolve({info: 'Wrong credentials'})

          return this.login(userId, req)
        })
    })
}

export default routeLogin
