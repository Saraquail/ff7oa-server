const xss = require('xss')

const MonstersService = {
  getAllMonsters(db) {
    return db
      .select(
      'mon.id',
      'mon.name',
      'mon.hp',
      'mon.mp',
      'mon.exp',
      'mon.ap',
      'mon.gil',
      'mon.weakness',
      'mon.strength',
      'mon.location',
      'mon.level',
      'mon.steal',
      'mon.drops',
      'mon.morph',
      'mon.enemy_skill',
      )
      .from('monsters AS mon')
  },

  getById(db, id) {
    return MonstersService.getAllMonsters(db)
      .where('mon.id', id)
      .first()
  },

  doesMonsterExist(db, name) {
    return db('monsters')
      .where({ name })
      .first()
      .then(monster => !!monster)
  },

  serializeMonster(monster) {
    
    return {
      id: monster.id,
      name: xss(monster.name),
      hp: monster.hp,
      mp: monster.mp,
      exp: monster.exp,
      ap: monster.ap,
      gil: monster.gil,
      weakness: xss(monster.weakness),
      strength: xss(monster.strength),
      location: xss(monster.location),
      level: monster.level,
      steal: xss(monster.steal),
      drops: xss(monster.drops),
      morph: xss(monster.morph),
      enemy_skill: xss(monster.enemy_skill),
    }
  },

  insertMonster(db, newMonster) {
    return db
      .insert(newMonster)
      .into('monsters')
      .returning('*')
      .then(([monster]) => monster)
      .then(monster => 
        MonstersService.getById(db, monster.id)
        )
  },
}

module.exports = MonstersService
