function parseRecoverPasswordRequest(req) {
  let { email } = req.body;

  if (!email) return Promise.resolve({info: 'Missing email'});

  return Promise.resolve({data: {email}});
}

export default parseRecoverPasswordRequest;
