const express = require('express')
const path = require('path')
const MonstersService = require('./monsters-service')

const monstersRouter = express.Router()
const parser = express.json()

monstersRouter
  .route('/')

  .get((req, res, next) => {
    MonstersService.getAllMonsters(
      req.app.get('db')
    )
      .then(monsters => {
        res.json(monsters)
      })
      .catch(next)
  })

  //.post(parser, (req, res, next) => {
  //   const 
  // })

  module.exports = monstersRouter