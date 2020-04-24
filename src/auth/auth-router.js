const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const parser = express.json()

authRouter
  .post('/login', parser, (req, res, next) => {
    const { user_name, password } = req.body
    const loginUser = { user_name, password }

    for (const[key, value] of Object.entries(loginUser)) {
      if(value == null) {

        return res.status(400).json({
          error: `Missing ${key}`
        })
      }
    }

    AuthService.getThisUser(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(thisUser => {
        if (!thisUser) {
          return res.status(400).json({
            error: 'Incorrect user_name or password'
          })
        }
        return AuthService.comparePasswords(loginUser.password, thisUser.password)
          .then(match => {
            if(!match) {
              return res.status(400).json({
                error: 'Incorrect user_name or password' })
            }
            const subject = thisUser.user_name
            const payload = { user_id: thisUser.id}

            res.send({
              authToken: AuthService.createJwt(subject, payload),
              user_name: subject
            })
          })
      })
    .catch(next)
  })

  module.exports = authRouter