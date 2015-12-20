async function routeConfirmRegistration (req) {
  let userId = await this.parseConfirmEmailRequest(req)

  await this.sendRegistrationConfirmationComplete(userId)

  await this.confirmEmail(userId)

  await this.login(userId, req)
}

export default routeConfirmRegistration
