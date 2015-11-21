function parseChangeEmailRequest (req) {
  let { email } = req.body

  if (!email) return Promise.resolve({info: 'Missing email'})
  if (!this.options.emailRegex.test(email)) return Promise.resolve({info: 'Incorrect email'})

  return Promise.resolve({data: {email}})
}

export default parseChangeEmailRequest
