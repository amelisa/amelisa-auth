async function routeLogin (req) {
  let { data, info } = await this.parseLoginRequest(req)
  if (info) return {info}
  let { email, password } = data

  let result = await this.authenticate(email, password)
  if (result && result.info) return result
  if (!result || !result.userId) return {info: 'Wrong credentials'}

  let { userId } = result

  await this.login(userId, req)

  return {userId}
}

export default routeLogin
