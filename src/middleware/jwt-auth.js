

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''
  let bearerToken

  if(!authToken.toLowerCase().startsWith('bearer ')){
    return res.status(401).json({
      error: 'Missing bearer token'
    })
  }
  else {
    bearerToken = authToken.slice(7, authToken.length)
  }

  //try 
}

module.exports = {
  requireAuth
}