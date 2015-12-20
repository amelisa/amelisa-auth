async function routeResetPassword (req) {
  let { data, info } = await this.parseResetPasswordRequest(req)
  if (info) return {info}
  let { password, secret } = data

  await this.sendResetPassword(secret, password)

  return this.resetPassword(secret, password)
}

export default routeResetPassword
