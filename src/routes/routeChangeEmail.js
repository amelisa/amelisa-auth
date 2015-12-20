async function routeChangeEmail (req) {
  let userId = req.session.userId

  let { data, info } = await this.parseChangeEmailRequest(req)
  if (info) return {info}
  let { email } = data

  return this.changeEmail(userId, email)
}

export default routeChangeEmail
