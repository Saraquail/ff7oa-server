const xss = require("xss");
const Service = require('../base-service');


class MonstersService extends Service {

  constructor(table_name) {
    super(table_name);
  }

  doesMonsterExist(db, name) {
    return db("monsters")
      .where({ name })
      .first()
      .then((monster) => !!monster);
  }

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
    };
  }
};

module.exports = new MonstersService('monsters');
