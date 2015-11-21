function routeConfirmEmailChange (req) {
  return this
    .parseConfirmEmailRequest(req)
    .then(({data, info}) => {
      if (info) return Promise.resolve({info})

      let {userId} = data
      return this
        .confirmEmail(userId)
        .then(() => this.login(userId, req))
    })
}

export default routeConfirmEmailChange
