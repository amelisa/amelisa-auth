function routeConfirmEmailChange (req) {
  return Promise
    .resolve(this.parseConfirmEmailRequest(req))
    .then(({data, info}) => {
      if (info) return {info}

      let {userId} = data
      return this
        .confirmEmail(userId)
        .then(() => this.login(userId, req))
    })
}

export default routeConfirmEmailChange
