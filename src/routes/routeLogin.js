async function routeLogin (req) {
  let { data, info } = await this.parseLoginRequest(req)
  if (info) return {info}
  let { email, password } = data

  let userId = await this.authenticate(email, password)
  if (!userId) return {info: 'Wrong credentials'}

  await this.login(userId, req)
}

export default routeLogin
