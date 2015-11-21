function routeChangePassword (req) {
  let userId = req.session.userId

  return this
    .parseChangePasswordRequest(req)
    .then(({data, info}) => {
      if (info) return Promise.resolve({info})

      let { oldpassword, password } = data
      return this
        .changePassword(userId, oldpassword, password)
        .then((data) => {
          if (data && data.info) return Promise.resolve({info: data.info})

          return this.sendChangePassword(userId, password)
        })
    })
}

export default routeChangePassword
