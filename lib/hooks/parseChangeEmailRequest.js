function parseChangeEmailRequest (req) {
  let { email } = req.body

  if (!email) return {info: 'Missing email'}
  if (!this.options.emailRegex.test(email)) return {info: 'Incorrect email'}

  return {data: {email}}
}

export default parseChangeEmailRequest
