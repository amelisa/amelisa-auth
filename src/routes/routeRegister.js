async function routeRegister (req) {
  let userId = req.session.userId

  let { data, info } = await this.parseRegisterRequest(req)
  if (info) return {info}
  let { email, password, userData } = data

  await this.register(userId, email, password, userData)

  await this.login(userId, req)

  return {userId}
}

export default routeRegister
