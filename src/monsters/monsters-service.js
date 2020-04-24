const xss = require('xss')

const MonstersService = {
  getAllMonsters(db) {
    return db
      .select(
      'mon.id',
      'mon.user_id',
      'mon.name',
      'mon.hp',
      'mon.mp',
      'mon.exp',
      'mon.gil',
      'mon.weakness',
      'mon.strength',
      'mon.location',
      'mon.level',
      'mon.steal',
      'mon.drops',
      'mon.enemy_skill',
      'usr.user_name'
      )
      .from('ff7oa_monsters AS mon')
      .leftJoin(
        'ff7oa_users AS usr',
        'mon.user_id',
        'usr.id'
        )
  },

  getById(db, id) {
    return MonstersService.getAllMonsters(db)
      .where('mon.id', id)
      .first()
  },

  doesMonsterExist(db, name) {
    return db('ff7oa_monsters')
      .where({ name })
      .first()
      .then(monster => !!monster)
  },

  serializeMonster({ user_name, ...monster }) {
    
    return {
      id: monster.id,
      user_id: monster.user_id,
      ...(user_name ? { user_name } : {}),
      user_name: xss(user_name),
      name: xss(monster.name),
      hp: monster.hp,
      mp: monster.mp,
      exp: monster.exp,
      gil: monster.gil,
      weakness: xss(monster.weakness),
      strength: xss(monster.strength),
      location: xss(monster.location),
      level: monster.level,
      steal: xss(monster.steal),
      drops: xss(monster.drops),
      enemy_skill: xss(monster.enemy_skill),
    }
  },

  insertMonster(db, newMonster) {
    return db
      .insert(newMonster)
      .into('ff7oa_monsters')
      .returning('*')
      .then(([monster]) => monster)
      .then(monster => 
        MonstersService.getById(db, monster.id)
        )
  },

}

module.exports = MonstersService
