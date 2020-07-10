const xss = require('xss')
const Service = require('../base-service');

class WeaponsService extends Service {
  constructor(table_name) {
    super(table_name);
  }

  serializeWeapon(weapon) {
    return {
      id: weapon.id,
      name: xss(weapon.name),
      character: xss(weapon.character),
      location: xss(weapon.location),
      slots: weapon.slots,
      growth: xss(weapon.growth),
    }
  }
}

module.exports = new WeaponsService('weapons');
