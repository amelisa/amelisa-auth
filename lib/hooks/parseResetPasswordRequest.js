function parseResetPasswordRequest (req) {
  let { secret, password, confirm } = req.body

  if (!secret) return {info: 'Secret is missing'}
  if (!password || !confirm) return {info: 'Please fill all fields'}
  if (password !== confirm) return {info: 'Password should match confirmation'}

  return {data: {secret, password}}
}

export default parseResetPasswordRequest
