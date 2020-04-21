const express = require('express')
const path = require('path')
const MonstersService = require('./monsters-service')
const UsersService = require('../users/users-service')

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

  .post(parser, (req, res, next) => {
    const { name, hp, mp, exp, gil, weakness, strength, location, level, steal, drops, enemy_skill } = req.body.monster
    const newMonster = { name, hp, mp, exp, gil, weakness, strength, location, level, steal, drops, enemy_skill }

    for (const [key, value] of Object.entries(newMonster)) {
      if (!value)
        {return res.status(400).json({
          error: `Missing '${key}'`
        })}
    }
    newMonster.id = req.body.id

    user_id = UsersService.getUserIdByName(req.app.get('db'), req.body.user_name)

    newMonster.user_id = user_id

    MonstersService.doesMonsterExist(
      req.app.get('db'), name)
      .then(doesMonsterExist => {
        if(doesMonsterExist) {
          console.log(doesMonsterExist)
          return res.status(400).json({
            error: 'Monster already exists'
          })
        }
      
        MonstersService.insertMonster(
          req.app.get('db'),
          newMonster
        )
          .then(monster => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${monster.id}`))
              .json(MonstersService.serializeMonster(monster))
          })
      })
      .catch(next)
  })

monstersRouter
  .route('/:monster_id')
  .all((req, res, next) => {

    MonstersService.getById(
      req.app.get('db'),
      req.params.monster_id
    )
      .then(monster => {
        if(!monster) {
          return res  
            .status(404)
            .json({
              error: { message: 'Monster does not exist' }
            })
        }
        res.monster = monster
        next()
      })
      .catch(next)
  })

  .get((req, res) => {
    res.json(MonstersService.serializeMonster(res.monster))
  })


  module.exports = monstersRouter