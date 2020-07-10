const xss = require("xss");
const Service = require("../base-service");

class LimitsService extends Service {
  constructor(table_name) {
    super(table_name);
  }

  serializeLimits(limit) {
    return {
      id: limit.id,
      character: xss(limit.character),
      name: xss(limit.name),
      level: limit.level,
      description: xss(limit.description),
      obtain_by: xss(limit.obtain_by),
    };
  }
}

module.exports = new LimitsService("limits");
