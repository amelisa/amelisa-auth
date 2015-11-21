function authenticate (email, password) {
  email = email.toLowerCase()

  return this
    .getUserByEmail(email)
    .then((user) => {
      if (!user) return

      return this
        .passwordMatch(user, password)
        .then((match) => {
          if (!match) return

          return user._id
        })
    })
}

export default authenticate
