function parseRecoverPasswordRequest (req) {
  let { email } = req.body

  if (!email) return {info: 'Missing email'}

  return {data: {email}}
}

export default parseRecoverPasswordRequest
