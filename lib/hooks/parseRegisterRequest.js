function parseRegisterRequest (req) {
  let { email, password, confirm } = req.body

  if (!email || !password || !confirm) return Promise.resolve({info: 'Please fill all fields'})
  if (password !== confirm) return Promise.resolve({info: 'Password should match confirmation'})
  // There is no good way to test emails by regex. The only good way is to send confirmation letter
  // This regex should pass all correct emails, but can pass some incorrect emails also
  if (!this.options.emailRegex.test(email)) return Promise.resolve({info: 'Incorrect email'})
  if (password.length < 6) return Promise.resolve({info: 'Password length should be at least 6'})

  // You can pass custom values to new user with help of userData parameter
  // For example we can pass userId from session
  var userData = {}

  return Promise.resolve({data: {email, password, userData}})
}

export default parseRegisterRequest
