function routeLogout(req) {
  this.logout(req);

  return Promise.resolve(true);
}

export default routeLogout;
