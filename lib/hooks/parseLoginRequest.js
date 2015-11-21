function parseLoginRequest (req) {
  let { email, password } = req.body

  if (!email || !password) return {info: 'Missing credentials'}

  return {data: {email, password}}
}

export default parseLoginRequest
