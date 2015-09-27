function logout(req) {
  delete req.session.userId;

  req.logout();
}

export default logout;
