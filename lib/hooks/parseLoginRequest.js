function parseLoginRequest(req) {
  let { email, password } = req.body;

  if (!email || !password) return Promise.resolve({info: 'Missing credentials'});

  return Promise.resolve({data: {email, password}});
}

export default parseLoginRequest;
