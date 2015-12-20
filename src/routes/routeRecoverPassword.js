async function routeRecoverPassword (req) {
  let { data, info } = await this.parseRecoverPasswordRequest(req)
  if (info) return {info}
  let { email } = data

  let { userId, secret } = await this.resetPasswordSecret(email)

  await this.sendRecoveryConfirmation(userId, email, secret)
}

export default routeRecoverPassword
