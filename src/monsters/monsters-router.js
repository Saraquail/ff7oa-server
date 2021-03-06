const express = require('express')
const path = require('path')
const MonstersService = require('./monsters-service')
const UsersService = require('../users/users-service')
const { requireAuth } = require('../middleware/jwt-auth')
const monstersRouter = express.Router()
const parser = express.json()

monstersRouter
  .route('/')

  .get((req, res, next) => {
    MonstersService.getAllMonsters(
      req.app.get('db')
    )
      .then(monsters => {
        res.json(monsters.map(MonstersService.serializeMonster))
      })
      .catch(next)
  })

  .post(requireAuth, parser, (req, res, next) => {
    const { 
      monster: { name, hp, mp, exp, gil, weakness, strength, location, level, steal, drops, enemy_skill },
      user_name
    } = req.body;
    
    let newMonster = { name, hp, mp, exp, gil, weakness, strength, location, level, steal, drops, enemy_skill };

    for (const [key, value] of Object.entries(newMonster)) {
      if (!value)
        {return res.status(400).json({
          error: `Missing '${key}'`
        })}
    }

    newMonster.user_id = UsersService.getUserIdByName(
      req.app.get('db'),
      user_name
      )

    MonstersService.doesMonsterExist(
      req.app.get('db'), name)
      .then(doesMonsterExist => {
        if(doesMonsterExist) {
          return res.status(400).json({
            error: 'Monster already exists'
          })
        }

        newMonster = MonstersService.serializeMonster(newMonster)
      
        MonstersService.insertMonster(
          req.app.get('db'),
          newMonster
        )
          .then(monster => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${monster.id}`))
              .json({ ...monster, user_name })
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