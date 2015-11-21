function routeLogout (req) {
  this.logout(req)

  return Promise.resolve()
}

export default routeLogout
