function parseConfirmEmailRequest (req) {
  let userId = req.query.id

  if (!userId) return {info: 'Missing id'}

  return {data: {userId}}
}

export default parseConfirmEmailRequest
