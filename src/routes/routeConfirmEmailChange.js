async function routeConfirmEmailChange (req) {
  let { data, info } = await this.parseConfirmEmailRequest(req)
  if (info) return {info}
  let { userId } = data

  await this.confirmEmail(userId)

  await this.login(userId, req)
}

export default routeConfirmEmailChange
