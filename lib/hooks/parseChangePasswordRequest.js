function parseChangePasswordRequest (req) {
  let { oldpassword, password, confirm } = req.body

  if (!oldpassword || !password || !confirm) return Promise.resolve({info: 'Please fill all fields'})
  if (password !== confirm) return Promise.resolve({info: 'Password should match confirmation'})

  return Promise.resolve({data: {oldpassword, password}})
}

export default parseChangePasswordRequest
