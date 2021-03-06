function parseChangePasswordRequest (req) {
  let { oldpassword, password, confirm } = req.body

  if (!oldpassword || !password || !confirm) {
    return {info: 'Please fill all fields'}
  }

  if (password !== confirm) {
    return {info: 'Password should match confirmation'}
  }

  return {data: {oldpassword, password}}
}

export default parseChangePasswordRequest
