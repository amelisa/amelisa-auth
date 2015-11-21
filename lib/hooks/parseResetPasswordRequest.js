function parseResetPasswordRequest (req) {
  let { secret, password, confirm } = req.body

  if (!secret) return Promise.resolve({info: 'Secret is missing'})
  if (!password || !confirm) return Promise.resolve({info: 'Please fill all fields'})
  if (password !== confirm) return Promise.resolve({info: 'Password should match confirmation'})

  return Promise.resolve({data: {secret, password}})
}

export default parseResetPasswordRequest
