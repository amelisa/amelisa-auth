function parseConfirmEmailRequest (req) {
  let userId = req.query.id

  if (!userId) return Promise.resolve({info: 'Missing id'})

  return Promise.resolve({data: {userId}})
}

export default parseConfirmEmailRequest
