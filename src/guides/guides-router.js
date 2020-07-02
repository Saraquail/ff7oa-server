const express = require('express')
const path = require('path')
const GuidesService = require('./guides-service')
const UsersService = require('../users/users-service')
const { requireAuth } = require('../middleware/jwt-auth')
const guidesRouter = express.Router()
const parser = express.json()

guidesRouter
  .route('/:user_name')
  .all(requireAuth)
  .get((req, res, next) => {

    const user_name = req.params.user_name
    
    user_id = UsersService.getUserIdByName(req.app.get('db'), user_name)
    //you should refactor to make this a single database query
    GuidesService.getAllGuides(req.app.get('db'), user_id)
      .then(guide => {
        res.json(guide)
      })
      .catch(next)
  })

  .post(parser, (req, res, next) => {
    const { name, note, monster_id } = req.body.guide
    const user_name = req.params.user_name
    const newGuide = { name, note, monster_id }

    for (const [key, value] of Object.entries(newGuide)) {
      if (!value)
        {return res.status(400).json({
          error: `Missing '${key}'`
        })}
    }

    newGuide.user_id = UsersService.getUserIdByName(
      req.app.get('db'),
      user_name
      )

    GuidesService.insertGuide(
      req.app.get('db'),
      newGuide
    )
      .then(guide => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl))
          .json(GuidesService.serializeGuides(guide))
      })
      .catch(next)
  })

  guidesRouter
  .route('/:user_name/:guide_id')
  .delete((req, res, next) => {
    GuidesService.deleteGuide(
      req.app.get('db'),
      req.params.guide_id)
      .then(rows => {
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = guidesRouter