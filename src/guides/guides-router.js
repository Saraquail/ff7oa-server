const express = require('express')
const path = require('path')
const GuidesService = require('./guides-service')
const guidesRouter = express.Router()
const parser = express.json()

guidesRouter
  .route('/:user_id')

  .get((req, res, next) => {
    const user_id = req.params.user_id
    GuidesService.getAllGuides(req.app.get('db'), user_id)
      .then(guides => {
        res.json(guides.map(GuidesService.serializeGuides))
      })
      .catch(next)
  })

  //.post()

  module.exports = guidesRouter