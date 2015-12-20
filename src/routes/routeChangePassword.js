async function routeChangePassword (req) {
  let userId = req.session.userId

  let { data, info } = await this.parseChangePasswordRequest(req)
  if (info) return {info}
  let { oldpassword, password } = data

  data = await this.changePassword(userId, oldpassword, password)
  if (data && data.info) return {info: data.info}

  return this.sendChangePassword(userId, password)
}

export default routeChangePassword
