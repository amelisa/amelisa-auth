function routeChangePassword (req) {
  let userId = req.session.userId

  return Promise
    .resolve(this.parseChangePasswordRequest(req))
    .then(({data, info}) => {
      if (info) return {info}

      let { oldpassword, password } = data
      return this
        .changePassword(userId, oldpassword, password)
        .then((data) => {
          if (data && data.info) return {info: data.info}

          return this.sendChangePassword(userId, password)
        })
    })
}

export default routeChangePassword
