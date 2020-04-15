const express = require('express')
const path = require('path')
const GuidesService = require('./guides-service')
const UsersService = require('../users/users-service')
const guidesRouter = express.Router()
const parser = express.json()

guidesRouter
  .route('/:user_id')

  .get((req, res, next) => {
    const user_name = req.body.user_name
    user_id = UsersService.getUserIdByName(req.app.get('db'), user_name)
    GuidesService.getAllGuides(req.app.get('db'), user_id)
      .then(guides => {
        res.json(guides.map(GuidesService.serializeGuides))
      })
      .catch(next)
  })

  .post(parser, (req, res, next) => {
    const { name, note } = req.body.guide
    const user_name = req.body.user_name

    const newGuide = { name, note }

    for (const [key, value] of Object.entries(newMonster)) {
      if (!value)
        {return res.status(400).json({
          error: `Missing '${key}'`
        })}
    }

    user_id = UsersService.getUserIdByName(req.app.get('db'), user_name)

    newGuide.user_id = user_id

    GuidesService.insertGuide(
      req.app.get('db'),
      newGuide
    )
      .then(guide => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(GuidesService.serializeGuides(guide))
      })
      .catch(next)
  })

  module.exports = guidesRouter