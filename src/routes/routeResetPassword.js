async function routeResetPassword (req) {
  let { data, info } = await this.parseResetPasswordRequest(req)
  if (info) return {info}
  let { password, secret } = data

  let result = await this.resetPassword(secret, password)
  if (result.info) return {info: result.info}

  let { user } = result
  await this.sendResetPassword(user.email, password)
}

export default routeResetPassword
