function login (userId, req) {
  req.session.userId = userId

  return new Promise((resolve, reject) => {
    req.login(userId, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

export default login
