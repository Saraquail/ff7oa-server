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

  serializeMonster(monster) {
    return Object.entries(monster)
      // sanitize all values
      .map(([key, value]) => [key, xss(value)])
      // return them back as an object
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
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
