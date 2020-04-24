const express = require('express')
const path = require('path')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const parser = express.json()

usersRouter
  .post('/', parser, (req, res, next) => {
    const { user_name, password } = req.body

    for (const field of ['user_name', 'password']) {
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing ${field}`
        })
    }
  
    const passError = UsersService.validatePassword(password)

    if(passError)
      return res.status(400).json({
        error: passError
      })

    UsersService.doesUserExist(
      req.app.get('db'),
      user_name
    )
      .then(doesUserExist => {
        if (doesUserExist)
          return res.status(400).json({
            error: 'Username already taken'
          })
        
        return UsersService.hashPassword(password)
          .then(hashed => {
            const newUser = {
              user_name,
              password: hashed
            }
            
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                .status(201)
                .location(
                  path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

  module.exports = usersRouter